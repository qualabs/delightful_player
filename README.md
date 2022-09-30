# videojs-delightful-player

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
  - [`<script>` Tag](#script-tag)
  - [Example usage](#example-usage)
- [Config file](#config-file)
- [Video Formats](#video-formats)
- [Light configuration](#light-configuration)
- [License](#license)
  
<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Introduction

The mainly feature of this plugin is that takes the average pixels from a video, and enlight the environment according with the predominant colors. There are 3 modes to see the lights (see `Light configuration` section)

## Installation

```sh
npm install --save @lights-plugin/videojs-delightful-player
```

## Usage

To include videojs-delightful-player on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js](https://videojs.com/), so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-delightful-player.min.js"></script>
<script>
  var player = videojs('my-video');

  player.delightfulPlayer();
</script>
```

### Example usage

Execute the application using

```html
npm run start
```

and open in your browser

```html
localhost:9999
```

An example video (Big buck bunny) will be played automatically. In order to choose other examples, the select component can be used. It is also possible to enter other video urls in the input.

The example file is [index.html](https://github.com/qualabs/delightful_player/blob/main/index.html).

### Config file

Under this file you'll find a couple of parameters.

- MODOWEB: if this value is true, you'll see the video colors in the web, in divs objects. If you want to use the lights, you have to set this parameter in false. Also you have to set the IP and PORT of the server.
- SERVER_IP, SERVER_PORT: raspberry pi IP and port, where is running the code that receive the pixel colors and turn on the corresponding light.

### Video Formats

For now, it's possible to do playback with m3u8(hls) or dash videos.

### Light configuration

To select the light configuration wanted, click on the button called `Lights` located on the right-bottom corner of the video player.

There are 3 different formats: mono, stereo and surround.

With the `mono` configuration, all lights will show the same color, with `stereo`, half of the lights will show the predominant color from half of the video and the other lights will show the predominant color from the other half. Finally, with the `surround` configuration, the screen will be divided in four quadrants and every light will show the predominant color from each quadrant.

### License

Qualabs
