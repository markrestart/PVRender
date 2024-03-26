import PVR from "./lib/PVR.js";
import RenderNode from "./lib/RenderNode.js";

let render = new PVR({
  width: 800,
  height: 600,
  backgroundColor: "#000000",
  duration: 10,
  fps: 24,
});

let node = new RenderNode(50, 50, 50, 50);
let animation = {
  type: "linear",
  start: 0,
  end: 10,
  from: { x: 50, y: 50 },
  to: { x: 1000, y: 1000 },
};
node.addAnimation(animation);

render.addChild(node);
render.render();
