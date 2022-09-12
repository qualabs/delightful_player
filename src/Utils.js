import videojs from 'video.js';
// const Plugin = videojs.getPlugin('plugin');


export function getModo(){
    return "stereo";
};

let canvas = document.querySelector(".canvas");
let ctx = canvas.getContext('2d');

function getCoordenates(channel){
    // let canvas = document.querySelector(".canvas");
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

export function getColors(type) {
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
    videojs.log(JSON.stringify(json_colors));
    return json_colors;
  }

export function paintColors(json_colors){
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