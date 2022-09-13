# videojs-delightful-player

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [`<script>` Tag](#script-tag)
  - [Browserify/CommonJS](#browserifycommonjs)
  - [RequireJS/AMD](#requirejsamd)
- [License](#license)
  - [Example usage](#example-usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Installation

```sh
npm install --save @lights-plugin/videojs-delightful-player
```

## Usage

To include videojs-delightful-player on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-delightful-player.min.js"></script>
<script>
  var player = videojs('my-video');

  player.delightfulPlayer();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-delightful-player via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('@lights-plugin/videojs-delightful-player');

var player = videojs('my-video');

player.delightfulPlayer();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', '@lights-plugin/videojs-delightful-player'], function(videojs) {
  var player = videojs('my-video');

  player.delightfulPlayer();
});
```

### Example usage

Execute the application using `npm run start` and open `localhost:9999`.
An example video (Big buck bunny) will be played automatically. In order to choose other examples, the select component can be used. It is also possible to enter other video urls in the input.

The example file is [index.html](https://github.com/qualabs/delightful_player/blob/M1_Documentation/index.html).

#### Light configuration

To select the light configuration wanted, click on the button called `Lights` located on the right-bottom corner of the video player.

There are 3 different formats: mono, stereo and surround.

With the `mono` configuration, the entire screen will change to the same color, with `stereo`, the screen will be divided in two and each half will have the predominant color of the video on that side of the screen. Finally, with the `surround` configuration, the screen will be divided in four quadrants.

## License

MIT. Copyright (c) rodrigog-qualabs &lt;rodrigog@qualabs.com&gt;

[videojs]: http://videojs.com/