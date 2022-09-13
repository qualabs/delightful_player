import videojs from "video.js";
var MenuButton = videojs.getComponent("MenuButton");
var MenuItem = videojs.getComponent("MenuItem");

class CustomMenuButton extends MenuButton {
  constructor(player, options = {}) {
    super(player, options);

    if (options.text) {
      this.updateTextContent(options.text);
    }
  }

  createItems() {
    videojs.log("createItems");
    let mono_item = new MenuItem(this.player(), { label: "Mono" });
    mono_item.handleClick = function () {
      this.player().trigger("mode", { content: "mono" });
    };
    let stereo_item = new MenuItem(this.player(), { label: "Stereo" });
    stereo_item.handleClick = function () {
      this.player().trigger("mode", { content: "stereo" });
    };
    let surround_item = new MenuItem(this.player(), { label: "Surround" });
    surround_item.handleClick = function () {
      this.player().trigger("mode", { content: "surround" });
    };
    return [mono_item, stereo_item, surround_item];
  }

  createEl(tag = "button", props = {}, attributes = {}) {
    let el = super.createEl(tag, props, attributes);
    el.classList.add("light-btn");
    el.innerHTML = "Lights";
    return el;
  }
}

videojs.registerComponent("CustomMenuButton", CustomMenuButton);

export default CustomMenuButton;
