"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
var canvas_1 = require("canvas");
var fs_1 = __importDefault(require("fs"));
function renderImagesToVideo(images, output, config) {
    var command = (0, fluent_ffmpeg_1.default)();
    command.inputFormat('image2');
    command.fps(config.fps);
    for (var i = 0; i < images.length; i++) {
        command.input(images[i]);
    }
    command.output(output)
        .on('end', function () {
        console.log('Finished processing');
    })
        .run();
}
function renderCanvasToImage(canvas, output) {
    var out = fs_1.default.createWriteStream(output);
    var stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', function () {
        console.log('The PNG file was created.');
    });
}
var PVR = /** @class */ (function () {
    function PVR(config) {
        this.renderNodes = [];
        this.canvas = (0, canvas_1.createCanvas)(config.width, config.height);
        this.canvas.style.backgroundColor = config.backgroundColor;
        this.config = config;
    }
    PVR.prototype.addChild = function (node) {
        this.renderNodes.push(node);
    };
    PVR.prototype.renderNode = function (ctx, node) {
        var _this = this;
        ctx.fillStyle = 'red';
        ctx.fillRect(node.x, node.y, node.width, node.height);
        node.children.forEach(function (child) {
            _this.renderNode(ctx, child);
        });
    };
    PVR.prototype.render = function () {
        var _this = this;
        var ctx = this.canvas.getContext('2d');
        if (!ctx)
            return;
        var frame = 0;
        var frameCount = this.config.duration * this.config.fps;
        var images = [];
        while (frame < frameCount) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderNodes.forEach(function (node) {
                _this.renderNode(ctx, node);
            });
            var filename = "frame-".concat(frame, ".png");
            renderCanvasToImage(this.canvas, filename);
            images.push(filename);
            frame++;
        }
        renderImagesToVideo(images, 'output.mp4', { fps: this.config.fps });
        // cleanup
        images.forEach(function (image) {
            fs_1.default.unlinkSync(image);
        });
    };
    return PVR;
}());
exports.default = PVR;
