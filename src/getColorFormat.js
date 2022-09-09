import videojs from 'video.js';
const Plugin = videojs.getPlugin('plugin');


//esta clase es un pasamanos. es para pasarle al selectFormat el color 
class getColorFormat extends Plugin {

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

    getColorFormat(){
        this.player.on('framecolor',function(color){
            console.log("estoy en el on "+ JSON.stringify(color));
            // videojs.log('the color value is' + color);
        })
    }
  }

  export default getColorFormat;
