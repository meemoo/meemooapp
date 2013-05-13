/* message should be object with frames (array of pixel data objects), delay (ms delay per frame), matte, transparent ([r,g,b]) */

/* listen for messages back that will be either {type:"progress", data:percent done} or {type:"gif", data:binary gif data} */

importScripts('omggif.js', 'NeuQuant.js'); 

var rgba2rgb = function (data, matte, transparent) {
  var pixels = [];
  var count = 0;
  var len = data.length;
  for ( var i=0; i<len; i+=4 ) {
    var r = data[i];
    var g = data[i+1];
    var b = data[i+2];
    var a = data[i+3];
    if (transparent && a===0) {
      // Use transparent color
      r = transparent[0];
      g = transparent[1];
      b = transparent[2];
    } else if (matte && a<255) {
      // Use matte with "over" blend mode
      r = ( (r*a + (matte[0] * (255-a))) / 255 ) |0;
      g = ( (g*a + (matte[1] * (255-a))) / 255 ) |0;
      b = ( (b*a + (matte[2] * (255-a))) / 255 ) |0;
    }
    pixels[count++] = r;
    pixels[count++] = g;
    pixels[count++] = b;
  }
  return pixels;
}

var rgb2num = function(palette) {
  var colors = [];
  var count = 0;
  var len = palette.length;
  for ( var i=0; i<len; i+=3 ) {
    colors[count++] = palette[i+2] | (palette[i+1] << 8) | (palette[i] << 16);
  }
  return colors;
}

self.onmessage = function(event) {
  var frames = event.data.frames;
  var framesLength = frames.length;
  var delay = event.data.delay / 10;

  var matte = event.data.matte ? event.data.matte : [255,255,255];
  var transparent = event.data.transparent ? event.data.transparent : false;

  var startTime = Date.now();

  var buffer = new Uint8Array( frames[0].width * frames[0].height * framesLength * 5 );
  var gif = new GifWriter( buffer, frames[0].width, frames[0].height, { loop: 0 } );
  // var pixels = new Uint8Array( frames[0].width * frames[0].height );

  var addFrame = function (frame) {
    var data = frame.data;

    // Make palette with NeuQuant.js
    var nqInPixels = rgba2rgb(data, matte, transparent);
    var len = nqInPixels.length;
    var nPix = len / 3;
    var map = [];
    var nq = new NeuQuant(nqInPixels, len, 10);
    // initialize quantizer
    var paletteRGB = nq.process(); // create reduced palette
    var palette = rgb2num(paletteRGB);
    // map image pixels to new palette
    var k = 0;
    for (var j = 0; j < nPix; j++) {
      var index = nq.map(nqInPixels[k++] & 0xff, nqInPixels[k++] & 0xff, nqInPixels[k++] & 0xff);
      // usedEntry[index] = true;
      map[j] = index;
    }

    var options = { palette: new Uint32Array( palette ), delay: delay };

    if (transparent) {
      options.transparent = nq.map(transparent[0], transparent[1], transparent[2]);
      options.disposal = 2; // Clear between frames
    }

    gif.addFrame( 0, 0, frame.width, frame.height, new Uint8Array( map ), options );
  }

  // Add all frames
  for (var i = 0; i<framesLength; i++) {
    addFrame( frames[i] );
    self.postMessage({
      type: "progress", 
      data: Math.round( (i+1)/framesLength*100 ) 
    });
  }

  // Finish
  var string = '';
  for ( var i = 0, l = gif.end(); i < l; i ++ ) {
    string += String.fromCharCode( buffer[ i ] );
  }

  self.postMessage({
    type: "gif", 
    data: string,
    frameCount: framesLength,
    encodeTime: Math.round( (Date.now()-startTime)/10 ) / 100
  });
};