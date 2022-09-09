import videojs from 'video.js';
import {version as VERSION} from '../package.json';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class DelightfulPlayer extends Plugin {

  /**
   * Create a DelightfulPlayer plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    this.player.ready(() => {
      this.player.addClass('vjs-delightful-player2');
    });
    this.player.on('playing', function() {
      videojs.log('playback began!');
    });
    // player.controlBar.addChild('QualitySelector', options);
  }
}

// Define default values for the plugin's `state` object here.
DelightfulPlayer.defaultState = {};

// Include the version number.
DelightfulPlayer.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('delightfulPlayer', DelightfulPlayer);

videojs.log('starting color!');
let video = document.getElementById('videojs-delightful-player-player');
let canvas = document.querySelector(".canvas");
let ctx = canvas.getContext('2d');


video.addEventListener('loadedmetadata', function() {
  canvas.width = video.videoWidth;
  videojs.log('canvas.width ' + canvas.width);
  canvas.height = video.videoHeight;
  videojs.log('canvas.height ' + canvas.height);
});

function getCoordenates(channel){
  switch(channel) {
    case "C":
      return {"sx":1, "sy":1, "sw":canvas.width, "sh":canvas.height};
    case "L":
      return {"sx":1, "sy":1, "sw":Math.round(canvas.width/2), "sh":canvas.height};
    case "R":
      return {"sx":Math.round(canvas.width/2)+1, "sy":1, "sw":Math.round(canvas.width/2), "sh":canvas.height};
    case "FL":
      return {"sx":1, "sy":1, "sw":Math.round(canvas.width/2), "sh":Math.round(canvas.height/2)};
    case "FR":
      return {"sx":Math.round(canvas.width/2)+1, "sy":1, "sw":Math.round(canvas.width/2), "sh":Math.round(canvas.height/2)};
    case "BL":
      return {"sx":1, "sy":Math.round(canvas.height/2)+1, "sw":Math.round(canvas.width/2), "sh":Math.round(canvas.height/2)};
    case "BR":
      return {"sx":Math.round(canvas.width/2)+1, "sy":Math.round(canvas.height/2)+1, "sw":Math.round(canvas.width/2), "sh":Math.round(canvas.height/2)};
    default:
      return {"sx":1, "sy":1, "sw":canvas.width, "sh":canvas.height};
  } 
}

function getPixels(channel){
  // obtain a sub image
  let coord = getCoordenates(channel);
  let image = ctx.getImageData(coord.sx, coord.sy, coord.sw, coord.sh);
  let pixels_data = image.data;

  // get the colors of the pixels of each of 4 pixels of the sub image
  let reds = [];
  let greens = [];
  let blues = [];
  
  for (var i = 0, counter = 0; i<pixels_data.length; i+=16, counter+=1){
    reds[counter] = pixels_data[i]
    greens[counter] = pixels_data[i+1]
    blues[counter] = pixels_data[i+2]

  }
  // calculate the average
  let average_red = Math.round(reds.reduce((partialSum, a) => partialSum + a, 0) / reds.length);
  let average_green = Math.round(greens.reduce((partialSum, a) => partialSum + a, 0) / greens.length);
  let average_blue = Math.round(blues.reduce((partialSum, a) => partialSum + a, 0) / blues.length);

  return {"red": average_red, "green": average_green, "blue":average_blue}
};

function getColors(type) {
  let json_colors;
  switch(type) {
    case "mono":
      let average_pixels_C = getPixels("C");
      json_colors = {"config": "mono", "channels": 
      {"C": [average_pixels_C.red,average_pixels_C.green,average_pixels_C.blue]}};
      break;
    case "stereo":
      let average_pixels_L = getPixels("L");
      let average_pixels_R = getPixels("R");
      json_colors = {"config": "stereo", "channels": 
      {"L": [average_pixels_L.red,average_pixels_L.green,average_pixels_L.blue], 
      "R":[average_pixels_R.red,average_pixels_R.green,average_pixels_R.blue]}}; 
      break;
    case "surround":
      let average_pixels_FL = getPixels("FL");
      let average_pixels_FR = getPixels("FR");
      let average_pixels_BL = getPixels("BL");
      let average_pixels_BR = getPixels("BR");
      json_colors =  {"config": "surround", "channels": 
      {"FL": [average_pixels_FL.red,average_pixels_FL.green,average_pixels_FL.blue], 
      "FR":[average_pixels_FR.red,average_pixels_FR.green,average_pixels_FR.blue], 
      "BL": [average_pixels_BL.red,average_pixels_BL.green,average_pixels_BL.blue], 
      "BR":[average_pixels_BR.red,average_pixels_BR.green,average_pixels_BR.blue]}};
      break;
  } 
  return json_colors;
}

function paintColors(json_colors){
  let div1 = document.querySelector(".div1");
  let div2 = document.querySelector(".div2");
  let div3 = document.querySelector(".div3");
  let div4 = document.querySelector(".div4");
  if (json_colors.config === "mono" && (json_colors.channels).length !== 0) {
    div1.style.backgroundColor = `rgb(${json_colors.channels.C})`;
    div3.style.backgroundColor = `rgb(${json_colors.channels.C})`;
    div2.style.backgroundColor = `rgb(${json_colors.channels.C})`;
    div4.style.backgroundColor = `rgb(${json_colors.channels.C})`;
  } else if (json_colors.config === "stereo" && (json_colors.channels).length !== 0) {
    div1.style.backgroundColor = `rgb(${json_colors.channels.L})`;
    div3.style.backgroundColor = `rgb(${json_colors.channels.L})`;
    div2.style.backgroundColor = `rgb(${json_colors.channels.R})`;
    div4.style.backgroundColor = `rgb(${json_colors.channels.R})`;
  } else if (json_colors.config === "surround" && (json_colors.channels).length !== 0) {
    div1.style.backgroundColor = `rgb(${json_colors.channels.FL})`;
    div3.style.backgroundColor = `rgb(${json_colors.channels.BL})`;
    div2.style.backgroundColor = `rgb(${json_colors.channels.FR})`;
    div4.style.backgroundColor = `rgb(${json_colors.channels.BR})`;
  }
};

video.addEventListener('play', function() {
  let $this = this; //cache
  let json_colors;
  (function loop() {
    if (!$this.paused && !$this.ended) {
      ctx.drawImage($this, 0, 0);
      json_colors = getColors("surround");
      paintColors(json_colors);
      setTimeout(loop, 1000 / 30); // drawing at 30fps
    }
  })();
}, 0);

export default DelightfulPlayer;
