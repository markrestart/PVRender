import PVR from './dist/PVR.js';
let render = new PVR({
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    duration: 10,
    fps: 30,
});

let node = new RenderNode({ x: 50, y: 50, width: 50, height: 50 });

render.addChild(node);
render.render();