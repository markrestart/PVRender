import ffmpeg from "fluent-ffmpeg";
import { createCanvas } from "canvas";
import fs from "fs";

async function renderImagesToVideo(imageFileNamePattern, output, config) {
  return new Promise((resolve, reject) => {
    var command = ffmpeg();
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

  renderNode(ctx, node) {
    ctx.fillStyle = "red";
    ctx.fillRect(node.x, node.y, node.width, node.height);
    node.children.forEach((child) => {
      this.renderNode(ctx, child);
    });
  }

  async render() {
    // if images folder does not exist create images folder
    if (!fs.existsSync(new URL("../images", import.meta.url).pathname)) {
      fs.mkdirSync(new URL("../images", import.meta.url).pathname);
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
        console.log("Rendering node", node);
        this.renderNode(ctx, node);
      });

      var filename = `frame-${frame}.png`;
      filename = new URL(`../images/${filename}`, import.meta.url).pathname;
      var imagePromise = renderCanvasToImage(this.canvas, filename);
      await imagePromise;
      images.push(filename);
      frame++;
    }

    var imageFileNamePattern = new URL("../images/frame-%d.png", import.meta.url).pathname;
    var videoFilename = new URL("../output.mp4", import.meta.url).pathname;
    var videoPromise = renderImagesToVideo(imageFileNamePattern, videoFilename, { fps: this.config.fps });
    await videoPromise;

    // cleanup
    images.forEach((image) => {
      fs.unlinkSync(image);
    });
    //remove images folder
    fs.rmdirSync(new URL("../images", import.meta.url).pathname);
  }
}

export default PVR;
