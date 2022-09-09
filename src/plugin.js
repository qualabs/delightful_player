import videojs from 'video.js';
import {version as VERSION} from '../package.json';
import { getModo, getColors } from './createJson.js';

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

    this.player.on('loadedmetadata', () => {
      let canvas = document.querySelector(".canvas");
      let video = this.player.tech_.el_;
      canvas.width = video.videoWidth;
      videojs.log('canvas.width ' + canvas.width);
      canvas.height = video.videoHeight;
      videojs.log('canvas.height ' + canvas.height);
    });

    this.player.on('playing', function() {
      videojs.log('playback began!');
    });

    this.player.on('play', this.loop.bind(this, this.player));
    // player.controlBar.addChild('QualitySelector', options);
  }

  loop(player) {
    videojs.log('starting color!');
    let canvas = document.querySelector(".canvas");
    let ctx = canvas.getContext('2d');

    if (!player.paused() && !player.ended()) {
      ctx.drawImage(player.tech_.el_, 0, 0);
      videojs.log("antes json");

      let modo   = getModo();

      videojs.log("el modo es " + modo);
      let jsonColor = getColors(modo);
      videojs.log("estos en pugin" + JSON.stringify(jsonColor));
      console.log("player " + player);
      //console.log("player.player " + player.playerId);
      //player.trigger('framecolor', jsonColor);

      videojs.log("antes on");
      this.paintColors(jsonColor);
      // player.on('framecolor',function(json_colors){
      //   videojs.log("estoy en el on ");
      //   // videojs.log('the color value is' + color);
      //   this.paintColors(json_colors);
      //   videojs.log("olakace");
      // })      
      setTimeout(this.loop.bind(this, player), 1000 / 30); // drawing at 30fps
    }
  }

  paintColors(json_colors){
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
}

// Define default values for the plugin's `state` object here.
DelightfulPlayer.defaultState = {};

// Include the version number.
DelightfulPlayer.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('delightfulPlayer', DelightfulPlayer);




export default DelightfulPlayer;
