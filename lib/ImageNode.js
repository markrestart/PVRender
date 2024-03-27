import RenderNode from "./RenderNode.js";

export default class ImageNode extends RenderNode {
  constructor(x, y, width, height, image) {
    super(x, y, width, height);
    this.image = image;
  }

  render(ctx) {
    ctx.drawImage(this.image, this.renderProps.x, this.renderProps.y, this.renderProps.width, this.renderProps.height);
    this.children.forEach((child) => {
      child.render(ctx);
    });
  }
}
