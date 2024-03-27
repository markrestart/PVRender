export class RenderNode {
  renderProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: "#000000",
  };

  children;
  animations;

  constructor(x, y, width, height, color = "#000000") {
    this.renderProps.x = x;
    this.renderProps.y = y;
    this.renderProps.width = width;
    this.renderProps.height = height;
    this.renderProps.color = color;
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
      let progress = 0;
      if(animation.type === 'linear') {
      progress = (frame - startframe) / (endframe - startframe);
      }
      else if(animation.type === 'ease-in') {
      progress = Math.pow((frame - startframe) / (endframe - startframe), 2);
      }
      else if(animation.type === 'ease-out') {
      progress = 1 - Math.pow((endframe - frame) / (endframe - startframe), 2);
      }
      else if(animation.type === 'ease-in-out') {
      progress = 0.5 - 0.5 * Math.cos(Math.PI * (frame - startframe) / (endframe - startframe));
      }
      else {
      throw new Error('Invalid animation type');
      }
      //for each property the animation has in from and to, if the node has that property, calculate the new value
      for (let key in animation.from) {
        if (animation.to.hasOwnProperty(key) && this.renderProps.hasOwnProperty(key)) {
          //if the property is a number, calculate the new value
          if(typeof animation.from[key] === 'number') {
            this.renderProps[key] = animation.from[key] + (animation.to[key] - animation.from[key]) * progress;
          }
          else if(typeof animation.from[key] === 'string' && animation.from[key].startsWith('#')) {
            //if the property is a color, calculate the new value
            const fromColor = parseInt(animation.from[key].substring(1), 16);
            const toColor = parseInt(animation.to[key].substring(1), 16);
            const fromR = (fromColor >> 16) & 0xff;
            const fromG = (fromColor >> 8) & 0xff;
            const fromB = fromColor & 0xff;
            const toR = (toColor >> 16) & 0xff;
            const toG = (toColor >> 8) & 0xff;
            const toB = toColor & 0xff;
            const r = fromR + (toR - fromR) * progress;
            const g = fromG + (toG - fromG) * progress;
            const b = fromB + (toB - fromB) * progress;
            this.renderProps[key] = `#${Math.round(r).toString(16)}${Math.round(g).toString(16)}${Math.round(b).toString(16)}`;
          }
        }
      }
    });
  }
}

export default RenderNode;
