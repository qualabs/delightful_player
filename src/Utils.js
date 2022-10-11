function getCoordenates(canvas, channel) {
  switch (channel) {
    case "C":
      return { sx: 1, sy: 1, sw: canvas.width, sh: canvas.height };
    case "L":
      return {
        sx: 1,
        sy: 1,
        sw: Math.round(canvas.width / 2),
        sh: canvas.height,
      };
    case "R":
      return {
        sx: Math.round(canvas.width / 2) + 1,
        sy: 1,
        sw: Math.round(canvas.width / 2),
        sh: canvas.height,
      };
    case "FL":
      return {
        sx: 1,
        sy: 1,
        sw: Math.round(canvas.width / 2),
        sh: Math.round(canvas.height / 2),
      };
    case "FR":
      return {
        sx: Math.round(canvas.width / 2) + 1,
        sy: 1,
        sw: Math.round(canvas.width / 2),
        sh: Math.round(canvas.height / 2),
      };
    case "BL":
      return {
        sx: 1,
        sy: Math.round(canvas.height / 2) + 1,
        sw: Math.round(canvas.width / 2),
        sh: Math.round(canvas.height / 2),
      };
    case "BR":
      return {
        sx: Math.round(canvas.width / 2) + 1,
        sy: Math.round(canvas.height / 2) + 1,
        sw: Math.round(canvas.width / 2),
        sh: Math.round(canvas.height / 2),
      };
    default:
      return { sx: 1, sy: 1, sw: canvas.width, sh: canvas.height };
  }
}

function getPixels(canvas, channel) {
  let ctx = canvas.getContext("2d");

  let coord = getCoordenates(canvas, channel);
  let image = ctx.getImageData(coord.sx, coord.sy, coord.sw, coord.sh);
  let pixels_data = image.data;

  // get the colors of the pixels of each of 4 pixels of the sub image
  let reds = [];
  let greens = [];
  let blues = [];

  for (var i = 0, counter = 0; i < pixels_data.length; i += 16, counter += 1) {
    reds[counter] = pixels_data[i];
    greens[counter] = pixels_data[i + 1];
    blues[counter] = pixels_data[i + 2];
  }

  // calculate the average
  let average_red = Math.round(
    reds.reduce((partialSum, a) => partialSum + a, 0) / reds.length
  );
  let average_green = Math.round(
    greens.reduce((partialSum, a) => partialSum + a, 0) / greens.length
  );
  let average_blue = Math.round(
    blues.reduce((partialSum, a) => partialSum + a, 0) / blues.length
  );
  return { red: average_red, green: average_green, blue: average_blue };
}

export function getColors(type, canvas) {
  let jsonColors;
  switch (type) {
    case "mono":
      let averagePixelsC = getPixels(canvas, "C");
      jsonColors = {
        config: "mono",
        channels: {
          C: [
            averagePixelsC.red,
            averagePixelsC.green,
            averagePixelsC.blue,
          ],
        },
      };
      break;
    case "stereo":
      let averagePixelsL = getPixels(canvas, "L");
      let averagePixelsR = getPixels(canvas, "R");
      jsonColors = {
        config: "stereo",
        channels: {
          L: [
            averagePixelsL.red,
            averagePixelsL.green,
            averagePixelsL.blue,
          ],
          R: [
            averagePixelsR.red,
            averagePixelsR.green,
            averagePixelsR.blue,
          ],
        },
      };
      break;
    case "surround":
      let averagePixelsFL = getPixels(canvas, "FL");
      let averagePixelsFR = getPixels(canvas, "FR");
      let averagePixelsBL = getPixels(canvas, "BL");
      let averagePixelsBR = getPixels(canvas, "BR");
      jsonColors = {
        config: "surround",
        channels: {
          FL: [
            averagePixelsFL.red,
            averagePixelsFL.green,
            averagePixelsFL.blue,
          ],
          FR: [
            averagePixelsFR.red,
            averagePixelsFR.green,
            averagePixelsFR.blue,
          ],
          BL: [
            averagePixelsBL.red,
            averagePixelsBL.green,
            averagePixelsBL.blue,
          ],
          BR: [
            averagePixelsBR.red,
            averagePixelsBR.green,
            averagePixelsBR.blue,
          ],
        },
      };
      break;
  }
  return jsonColors;
}
