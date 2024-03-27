import ffmpeg from "fluent-ffmpeg";
import { createCanvas } from "canvas";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

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
  constructor(config, intermeditaFoler = "images", output = "output", keepImages = false) {
    this.canvas = createCanvas(config.width, config.height);
    this.config = config;
    this.intermeditaFoler = intermeditaFoler;
    this.output = output;
    this.keepImages = keepImages;
  }
  canvas;
  renderNodes = [];
  config;

  addChild(node) {
    this.renderNodes.push(node);
  }

  async render() {
    const dirname = path.dirname(fileURLToPath(import.meta.url));

    // if images folder does not exist create images folder
    const imagesPath = path.join(dirname, "..", this.intermeditaFoler);
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
        node.render(ctx);
      });

      var filename = path.join(imagesPath, `frame-${frame}.png`);
      var imagePromise = renderCanvasToImage(this.canvas, filename);
      await imagePromise;
      images.push(filename);
      frame++;
    }

    var imageFileNamePattern = path.join(imagesPath, "frame-%d.png");
    var videoFilename = path.join(dirname, "..", this.output);
    var videoPromise = renderImagesToVideo(imageFileNamePattern, `${videoFilename}.mp4`, {
      fps: this.config.fps,
      width: this.config.width,
      height: this.config.height,
    });
    await videoPromise;

    // cleanup
    if (!this.keepImages) {
      images.forEach((image) => {
        fs.unlinkSync(image);
      });
      //remove images folder
      fs.rmdirSync(imagesPath);
    }
  }
}

export default PVR;
