# videojs-delightful-player

## Table of Contents
- [Introduction](#introduction)
- [Usage](#usage)
- [Light configuration](#light-configuration)
- [Video Formats](#video-formats)
- [Sample](#sample)
- [License](#license)
  
## Introduction
The mainly feature of this plugin is that takes the average pixels from a video, and enlight the environment according with the predominant colors. There are 3 modes to see the lights (see `Light configuration` section). 

If you want to use our DMX server implementation check out our [delightful-player-server](https://github.com/qualabs/delightful-player-server) repo.

## Usage
Get the script in whatever way you prefer and include the plugin _after_ you include [video.js](https://videojs.com/), so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-delightful-player.min.js"></script>
<script>
  var player = videojs('my-video');

  player.delightfulPlayer({
    serverUrl: "ws://<your-delightful-server-ip>:<port>" 
    // OPTIONAL: If you are using the delightful-player-server
  });
</script>
```

### Get the colors
After you initialize the plugin, you will listen to the `colorChanged` event triggered after each frame it was processed.

```javascript
player.on('colorChanged', (event, value) => {
  const {config, channels} = value;
  //Render each channel depending on configuration.
}
```
### Light configuration

To select the light configuration wanted, click on the button called `Lights` located on the right-bottom corner of the video player.

There are 3 different formats: 
```javascript 
{config: "mono", channels: {C: [R, G, B]}}
```
```javascript 
{config: "stereo", channels: {L: [R, G, B], R: [R, G, B]}}
```
```javascript 
{config: "suround", channels: {FL: [R, G, B], FR: [R, G, B], BL: [R, G, B], BR: [R, G, B]}}
```

With the `mono` configuration, all lights will show the same color, with `stereo`, half of the lights will show the predominant color from half of the video and the other lights will show the predominant color from the other half. Finally, with the `surround` configuration, the screen will be divided in four quadrants and every light will show the predominant color from each quadrant.

### Sample
Execute the application using

```html
npm run start
```

and open in your browser

```html
localhost:9999
```

An example video (Big buck bunny) will be played automatically. In order to choose other examples, the select component can be used. It is also possible to enter other video urls in the input.

The example file is [index.html](https://github.com/qualabs/videojs-delightful-player/blob/main/index.html).
### Video Formats

For now, it's possible to do playback with MP4, HLS or DASH videos.

### License
MIT
2022 Qualabs
