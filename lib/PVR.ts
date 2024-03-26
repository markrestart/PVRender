import { VideoRenderConfig } from "./VideoRenderConfig";
import { PVRConfig } from "./PVRConfig";
import RenderNode from './RenderNode';
import ffmpeg from 'fluent-ffmpeg';
import { createCanvas } from 'canvas';
import fs from 'fs';

function renderImagesToVideo(images: string[], output: string, config: VideoRenderConfig) {
    var command = ffmpeg();
    command.inputFormat('image2');
    command.fps(config.fps);
    for(var i = 0; i < images.length; i++) {
        command.input(images[i]);
    }
    command.output(output)
        .on('end', function() {
            console.log('Finished processing');
        })
        .run();
}

function renderCanvasToImage(canvas: any, output: string) {
    var out = fs.createWriteStream(output);
    var stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', function() {
        console.log('The PNG file was created.');
    });

}

class PVR {
    constructor(config: PVRConfig) {
        this.canvas = createCanvas(config.width, config.height)
        this.canvas.style.backgroundColor = config.backgroundColor;
        this.config = config;

    }
    canvas: any;
    renderNodes: RenderNode[] = [];
    config: PVRConfig;

    addChild(node: RenderNode) {
        this.renderNodes.push(node);
    }

    renderNode(ctx: any, node: RenderNode) {
        ctx.fillStyle = 'red';
        ctx.fillRect(node.x, node.y, node.width, node.height);
        node.children.forEach((child) => {
            this.renderNode(ctx, child);
        });
    }

    render() {
        var ctx = this.canvas.getContext('2d');
        if(!ctx) return;

        let frame = 0;
        let frameCount = this.config.duration * this.config.fps;
        let images: string[] = [];
        while(frame < frameCount) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderNodes.forEach((node) => {
                this.renderNode(ctx, node);
            });
            
            var filename = `frame-${frame}.png`;
            renderCanvasToImage(this.canvas, filename);
            images.push(filename);
            frame++;
        }


        renderImagesToVideo(images, 'output.mp4', {fps: this.config.fps});
        // cleanup
        images.forEach((image) => {
            fs.unlinkSync(image);
        });

    }


}


export default PVR;
export { PVRConfig, VideoRenderConfig };
