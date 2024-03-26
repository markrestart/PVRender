export declare class RenderNode {
    x: number;
    y: number;
    width: number;
    height: number;
    children: RenderNode[];
    animations: any[];
    constructor(x: number, y: number, width: number, height: number);
    addChild(node: RenderNode): void;
    addAnimation(animation: any): void;
}
export default RenderNode;
