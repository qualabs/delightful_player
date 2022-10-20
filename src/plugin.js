import videojs from "video.js";
import { version as VERSION } from "../package.json";

import { getColors } from "./utils.js";
import CustomMenuButton from "./menu.js";

const Plugin = videojs.getPlugin("plugin");

// Default options for the plugin.
const defaults = {
  mode: "mono",
};
const DMX_FRAMERATE = 30; // Enttec OpenDMX USB support maximum speed of 30 fps.
const DMX_VTT_LANGUAGE = "dmx";

class DelightfulPlayer extends Plugin {
  constructor(player, options) {
    super(player);

    this.options = videojs.mergeOptions(defaults, options);
    this.canvas = document.createElement("canvas");
    this.olaServer = null;
    this.lightLock = false;
    this.bpm= null

    if (this.options.serverUrl) {
      try {
        this.olaServer = new WebSocket(this.options.serverUrl);
      } catch (error) {
        videojs.log.error("[deLIGHTful] Connecting with OLA server: ", error);
      }
    }

    this.player.ready(() => {
      this.player.addClass("vjs-delightful-player2");
      let menu_button = new CustomMenuButton(this.player, this.options);
      player.controlBar.addChild(menu_button);
    });

    this.player.on("loadedmetadata", () => {
      let video = this.player.tech_.el_;
      this.canvas.width = video.videoWidth;
      this.canvas.height = video.videoHeight;
    });

    this.player.on("canplay", this.start.bind(this));

    this.player.on("mode", (_, lightingMode) => {
      this.options.mode = lightingMode.content;
    });

    this.player.on("ended", () => {
      this.player.currentTime(0);
      this.player.play();
    })

    this.player.on('dispose', () => {
      this.olaServer?.close();
    })
  }

  start() {
    this.findDMXTextTracks();
    this.player.on("play", () => {
      this.loop();
      this.flashLoop();
    });
  }

  findDMXTextTracks() {
    // Get all text tracks for the current player.
    let tracks = this.player.textTracks_.tracks_;

    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i];

      if (track.language !== DMX_VTT_LANGUAGE) {
        continue;
      }

      track.oncuechange = () => {
        if (track.activeCues.length > 0) {
          const command = JSON.parse(track.activeCues[0].text);
          const jsonMsg = { config: "custom", ...command }

          this.sendDMXCommand(jsonMsg);
          this.player.trigger("colorChanged", jsonMsg);
        }
      };
    }
  }

  loop() {
    let ctx = this.canvas.getContext("2d");

    if (!this.player.paused() && !this.player.ended()) {
      ctx.drawImage(this.player.tech_.el_, 0, 0);
      let jsonColor = getColors(this.options.mode, this.canvas);
      if (!this.lightLock) {
        this.sendDMXCommand(jsonColor);
        this.player.trigger("colorChanged", jsonColor);
      }

      setTimeout(this.loop.bind(this), 1000 / DMX_FRAMERATE);

    }
  }

  flashLoop() {
    let flash = {
      config: "stereo",
      channels: {
        L: [255, 255, 255],
        R: [255, 255, 255]
      }
    }
    this.lightLock = true;
    this.sendDMXCommand(flash);
    this.lightLock = false;
    // flash.channels.L = flash.channels.R = [0, 0, 0]
    setTimeout(this.flashLoop.bind(this), 483);
  }

  sendDMXCommand(command) {
    if (this.olaServer?.readyState == WebSocket.OPEN) {
      try {
        const msg = JSON.stringify(command);
        this.olaServer.send(msg);
      } catch (error) {
        videojs.log.error("[deLIGHTful] Sending package to OLA server: ", error);
      }
    }
  }
}

// Define default values for the plugin's `state` object here.
DelightfulPlayer.defaultState = {};
DelightfulPlayer.VERSION = VERSION;

videojs.registerPlugin("delightfulPlayer", DelightfulPlayer);

export default DelightfulPlayer;
