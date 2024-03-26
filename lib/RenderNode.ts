export class RenderNode {
    x: number;
    y: number;
    width: number;
    height: number;
    children: RenderNode[];

    animations: any[];

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.children = [];
        this.animations = [];
    }

    addChild(node: RenderNode) {
        this.children.push(node);
    }

    addAnimation(animation: any) {
        this.animations.push(animation);
    }
}

export default RenderNode;