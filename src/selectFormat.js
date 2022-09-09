// import getColorFormat from 'getColorFormat.js'; 


// esta clase se encarga del modo



function selectFormat(document) {
  // const obj = {
  //   mono: { config: 'mono', channels: { C: [150, 211, 132] } },
  //   stereo: {},
  //   surround: {}
  // };
  const obj = getColorFormat;
  console.log(JSON.stringify(obj));

  if (Object.keys(obj.mono).length !== 0) {
    document.querySelector('.div1').style.backgroundColor = `rgb(${obj.mono.channels.C})`;
    document.querySelector('.div3').style.backgroundColor = `rgb(${obj.mono.channels.C})`;
    document.querySelector('.div2').style.backgroundColor = `rgb(${obj.mono.channels.C})`;
    document.querySelector('.div4').style.backgroundColor = `rgb(${obj.mono.channels.C})`;
  } else if (Object.keys(obj.stereo).length !== 0) {
    document.querySelector('.div1').style.backgroundColor = `rgb(${obj.stereo.channels.L})`;
    document.querySelector('.div3').style.backgroundColor = `rgb(${obj.stereo.channels.L})`;
    document.querySelector('.div2').style.backgroundColor = `rgb(${obj.stereo.channels.R})`;
    document.querySelector('.div4').style.backgroundColor = `rgb(${obj.stereo.channels.R})`;
  } else if (Object.keys(obj.surround).length !== 0) {
    document.querySelector('.div1').style.backgroundColor = `rgb(${obj.surround.channels.FL})`;
    document.querySelector('.div3').style.backgroundColor = `rgb(${obj.surround.channels.BL})`;
    document.querySelector('.div2').style.backgroundColor = `rgb(${obj.surround.channels.FR})`;
    document.querySelector('.div4').style.backgroundColor = `rgb(${obj.surround.channels.BR})`;
  }
}

// module.exports = selectFormat();
