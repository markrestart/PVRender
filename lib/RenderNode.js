export class RenderNode {
  x;
  y;
  width;
  height;
  children;

  animations;

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.children = [];
    this.animations = [];
  }

  addChild(node) {
    this.children.push(node);
  }

  addAnimation(animation) {
    this.animations.push(animation);
  }

  animate(frame, fps) {
    this.animations.forEach((animation) => {
      const startframe = animation.start * fps;
      const endframe = animation.end * fps;
      if (frame < startframe || frame > endframe) {
        return;
      }
      let progress = (frame - startframe) / (endframe - startframe);
      let x = animation.from.x + (animation.to.x - animation.from.x) * progress;
      let y = animation.from.y + (animation.to.y - animation.from.y) * progress;
      this.x = x;
      this.y = y;
    });
  }
}

export default RenderNode;
