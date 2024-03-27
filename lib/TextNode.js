import RenderNode from "./RenderNode.js";

export default class TextNode extends RenderNode {
  constructor(x, y, width, height, text, color = "#000000") {
    super(x, y, width, height, color);
    this.text = text;
  }

  render(ctx) {
    ctx.fillStyle = this.renderProps.color;
    ctx.font = `${this.renderProps.height}px Arial`;
    ctx.fillText(this.text, this.renderProps.x, this.renderProps.y);
    this.children.forEach((child) => {
      child.render(ctx);
    });
  }
}
