/*global importScripts:true, self:true, MMCQ:true*/

// Import MMCQ

importScripts('../../libs/quantize.js');

// Meemoo stuff

// Strips alpha pixels from canvas and makes array like MMCQ wants it
var imageDataToPixelArray = function (imageData) {
  var pixels = [];
  var length = imageData.data.length;
  for (var i = 0; i < length; i+=4){
    var pixel = [imageData.data[i], imageData.data[i+1], imageData.data[i+2]];
    pixels.push(pixel);
  }
  return pixels;
};

// Converts [r,g,b] array into css color strings
var paletteToCSSPalette = function (palette) {
  var newPalette = [];
  var length = palette.length;
  for (var i = 0; i < length; i++){
    var css = "rgb("+palette[i][0]+","+palette[i][1]+","+palette[i][2]+")";
    // Only add unique colors
    if (newPalette.indexOf(css) === -1) {
      newPalette.push(css);
    }
  }
  return newPalette;
};

// Worker
self.addEventListener('message', function (e) {
  if (!e.data.imageData || !e.data.imageData.data.length || !e.data.maxColors) { return false; }

  var myPixels = imageDataToPixelArray( e.data.imageData );
  var maxColors = e.data.maxColors;
  var cmap = MMCQ.quantize(myPixels, maxColors);
  var palette = paletteToCSSPalette( cmap.palette() );
  self.postMessage( palette );
}, false);
