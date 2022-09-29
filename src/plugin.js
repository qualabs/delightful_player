import videojs from "video.js";
import { version as VERSION } from "../package.json";
import { getColors, paintColors } from "./Utils.js";
import { getModo } from "./getModo.js";
import { ws } from "./clientSocket.js";

const Plugin = videojs.getPlugin("plugin");

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
      this.player.addClass("vjs-delightful-player2");
    });

    this.player.on("loadedmetadata", () => {
      let canvas = document.querySelector(".canvas");
      let video = this.player.tech_.el_;
      canvas.width = video.videoWidth;
      // videojs.log('canvas.width ' + canvas.width);
      canvas.height = video.videoHeight;
      // videojs.log('canvas.height ' + canvas.height);
    });

    this.player.on("playing", function () {
      videojs.log("playback began!");
    });

    this.player.on("canplay", this.textColor.bind(this, this.player));
    // player.controlBar.addChild('QualitySelector', options);
  }

  textColor(player) {
    if (player.textTracks_.tracks_.length > 0) {
      for (let i = 0; i < player.textTracks_.tracks_.length; i++) {
        let track = player.textTracks_.tracks_[i];
        if (track.src) {
          this.sendColorFromTrack(player);
        } else {
          player.on("play", this.loop.bind(this, this.player));
        }
      }
    }
  }

  sendColorFromTrack(player) {
    // Get all text tracks for the current player.
    let tracks = player.textTracks_.tracks_;

    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i];

      track.oncuechange = () => {
        if (track.activeCues.length > 0) {
          // Parse the cue as JSON
          let color = JSON.parse(track.activeCues[0].text);
          console.log(color);
          try {
            const msg = JSON.stringify(color);
            if (ws.readyState == 1) {
              ws.send(msg);
            }
          } catch (error) {
            console.log("Error when send package. Error: " + error);
          }
        }
      };
    }
  }

  loop(player) {
    let canvas = document.querySelector(".canvas");
    let ctx = canvas.getContext("2d");

    if (!player.paused() && !player.ended()) {
      ctx.drawImage(player.tech_.el_, 0, 0);
      let modo = getModo(document);

      let jsonColor = getColors(modo);
      console.log(jsonColor);
      paintColors(jsonColor);
      setTimeout(this.loop.bind(this, player), 1000 / 30); // drawing at 30fps
    }
  }
}

// Define default values for the plugin's `state` object here.
DelightfulPlayer.defaultState = {};

// Include the version number.
DelightfulPlayer.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin("delightfulPlayer", DelightfulPlayer);

export default DelightfulPlayer;
