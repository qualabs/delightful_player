import videojs from 'video.js';
import {version as VERSION} from '../package.json';
import {getColors, paintColors} from './Utils.js';
import './menu.js'
import CustomMenuButton from './menu.js';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {
  mode: "mono"
};
let mode = defaults.mode;

const ws = new WebSocket("ws://192.168.107.219:5678/");


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
      // const ws = new WebSocket("ws://127.0.0.1:5678/");
      console.log("webSocket construido con exito " + ws);

    });

    this.player.on('loadedmetadata', () => {
      let canvas = document.querySelector(".canvas");
      let video = this.player.tech_.el_;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // const ws = new WebSocket("ws://127.0.0.1:5678/");
      // console.log("webSocket construido con exito " + ws);
    });

    this.player.on('playing', function() {
      videojs.log('playback began!');
    });

    this.player.on('play', this.loop.bind(this, this.player));
    let menu_button = new CustomMenuButton(this.player, this.options)
    player.controlBar.addChild(menu_button)

    this.player.on('mode', function(event, new_modo) {
      mode = new_modo.content;
    });
  }

  loop(player) {
    let canvas = document.querySelector(".canvas");
    let ctx = canvas.getContext('2d');

    if (!player.paused() && !player.ended()) {
      ctx.drawImage(player.tech_.el_, 0, 0);
      let jsonColor = getColors(mode);
      paintColors(jsonColor);
      try{
        const msg = JSON.stringify(jsonColor);
        while(ws.readyState != 1){
          console.log("websocket not open");
        }
        ws.send(msg);
      } catch(error){
        console.log('error en el send ' + error);
      }
      console.log("Msg sent ", JSON.stringify(jsonColor));
      setTimeout(this.loop.bind(this, player), 1000 / 30); // drawing at 30fps
    }
  }
}

// Define default values for the plugin's `state` object here.
DelightfulPlayer.defaultState = {};

// Include the version number.
DelightfulPlayer.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('delightfulPlayer', DelightfulPlayer);

export default DelightfulPlayer;
