import ffmpeg from "fluent-ffmpeg";
import { createCanvas } from "canvas";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

async function renderImagesToVideo(imageFileNamePattern, output, config) {
  return new Promise((resolve, reject) => {
    var command = ffmpeg();
    command.size(`${config.width}x${config.height}`);
    command.fps(config.fps);
    command.addInput(imageFileNamePattern);

    command
      .output(output)
      .on("end", function () {
        console.log("Finished processing");
        resolve();
      })
      .on("error", function (err) {
        console.error("Error processing:", err);
        reject(err);
      })
      .run();
  });
}

async function renderCanvasToImage(canvas, output) {
  return new Promise((resolve, reject) => {
    var out = fs.createWriteStream(output);
    var stream = canvas.createPNGStream();

    stream.on("error", function (err) {
      console.error("Error creating PNG stream:", err);
      reject(err);
    });

    out.on("error", function (err) {
      console.error("Error writing to file:", err);
      reject(err);
    });

    stream.pipe(out);
    out.on("finish", function () {
      resolve();
    });
  });
}

class PVR {
  constructor(config) {
    this.canvas = createCanvas(config.width, config.height);
    this.config = config;
  }
  canvas;
  renderNodes = [];
  config;

  addChild(node) {
    this.renderNodes.push(node);
  }

  renderNode(ctx, node, parent = null) {
    ctx.fillStyle = node.renderProps.color;
    ctx.fillRect(
      parent ? node.renderProps.x + parent.renderProps.x : node.renderProps.x, 
      parent ? node.renderProps.y + parent.renderProps.y : node.renderProps.y,
      node.renderProps.width,
      node.renderProps.height
      );
    node.children.forEach((child) => {
      this.renderNode(ctx, child);
    });
  }

  async render() {
    const dirname = path.dirname(fileURLToPath(import.meta.url));

    // if images folder does not exist create images folder
    const imagesPath = path.join(dirname, '..', 'images');
    if (!fs.existsSync(imagesPath)) {
      fs.mkdirSync(imagesPath);
    }

    var ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let frameCount = this.config.duration * this.config.fps;
    let images = [];
    while (frame < frameCount) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.config.backgroundColor !== "none") {
        ctx.fillStyle = this.config.backgroundColor;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }

      this.renderNodes.forEach((node) => {
        node.animate(frame, this.config.fps);
        this.renderNode(ctx, node);
      });

      var filename = path.join(imagesPath, `frame-${frame}.png`);
      var imagePromise = renderCanvasToImage(this.canvas, filename);
      await imagePromise;
      images.push(filename);
      frame++;
    }

    var imageFileNamePattern = path.join(imagesPath, "frame-%d.png");
    var videoFilename = path.join(dirname, '..', 'output.mp4');
    var videoPromise = renderImagesToVideo(imageFileNamePattern, videoFilename, { fps: this.config.fps, width: this.config.width, height: this.config.height});
    await videoPromise;

    // cleanup
    images.forEach((image) => {
      fs.unlinkSync(image);
    });
    //remove images folder
    fs.rmdirSync(imagesPath);
  }
}

export default PVR;
