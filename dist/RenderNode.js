"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderNode = void 0;
var RenderNode = /** @class */ (function () {
    function RenderNode(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.children = [];
        this.animations = [];
    }
    RenderNode.prototype.addChild = function (node) {
        this.children.push(node);
    };
    RenderNode.prototype.addAnimation = function (animation) {
        this.animations.push(animation);
    };
    return RenderNode;
}());
exports.RenderNode = RenderNode;
exports.default = RenderNode;
