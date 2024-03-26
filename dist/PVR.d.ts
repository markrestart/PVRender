import { VideoRenderConfig } from "./VideoRenderConfig";
import { PVRConfig } from "./PVRConfig";
import RenderNode from './RenderNode';
declare class PVR {
    constructor(config: PVRConfig);
    canvas: any;
    renderNodes: RenderNode[];
    config: PVRConfig;
    addChild(node: RenderNode): void;
    renderNode(ctx: any, node: RenderNode): void;
    render(): void;
}
export default PVR;
export { PVRConfig, VideoRenderConfig };
