# PVRender

PVRender is a Node module that allows you to programmatically create videos using canvas and ffmpeg.

## Installation

You can install PVRender using npm:
`npm install pvrender`

In addition to the node modules, your system will also need ffmpeg installed, and the path set:
Download and install ffmpeg following the correct version for your operating system.
[Download and install ffmpeg](https://ffmpeg.org/download.html)

## Usage

### PVR Class

The `PVR` class is the core of this project.

The constructor takes the following parameters:

- `config`: Object. Defines the video rendering options.
  - `width`: Number. How wide the video is in pixels.
  - `height`: Number. How high the video is in pixels.
  - `backgroundColor`: String. The color of the background of the video as a hexcode, including the leading #. "none" is also accepted. Although a fully rendered video will not be transparent, the intermediate images will have the transparency.
  - `duration`: Number. How long the video is in seconds.
  - `fps`: Number. The frames to render per second.
- `intermediateFolder`: String. Folder used to store rendered frame images. Relative to the operator directory. Defaults to "images".
- `output`: String. Name of output video. Do not include file extension. Defaults to "output".
- `keepImages`: Boolean. If true, will not remove the intermediate rendered image frames when the video is done rendering. Defaults to false.

The `PVR` class has two funcions.

- `addChild`: Takes in a renderNode and adds it to the scene.
- `render`: Renders the full scene to a video.

### RenderNode Class

The `RenderNode` class is used to define all the visuals of a video.

The constructor takes the following parameters:

- `x`: Number. The vertical position of the element in pixels.
- `y`: Number. The horizontal position of the element in pixels.
- `width`: Number. The width of the element in pixels.
- `height`: Number. The height of the element in pixels.
- `color`: String. The background color of the element as a hexcode, including the leading #. "none" is also accepted.

The `RenderNode` class has two funcions.

- `addChild`: Takes in a renderNode and adds it as a child of this node.
- `addAnimation`: Takes in an Animation and adds it to animate this node.

RenderNodes can also be made as a `TextNode` or `ImageNode`.

### Animation Object

The `Animation` objects are used to define all the changes of a node over time.

An animation object can have the following parameters:

- `type`: How the values should be animated, with the following options. "linear", "ease-in", "ease-out", "ease-in-out". Defaults to "linear".
- `start`: The time in seconds where the animation starts.
- `end`: The time in seconds where the animation ends.
- `from`: An object containing any values to animate with their value when the animation starts.
- `to`: An object containing any values to animate with their value when the animation starts.
