importScripts('omggif.js', 'NeuQuant.js'); 

var rgba2rgb = function (data) {
  var pixels = [];
  var count = 0;
  var len = data.length;
  for ( var i=0; i<len; i+=4 ) {
    pixels[count++] = data[i];
    pixels[count++] = data[i+1];
    pixels[count++] = data[i+2];
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

  var startTime = Date.now();

  // Looking at http://www.mrdoob.com/lab/javascript/omggif/
  var buffer = new Uint8Array( frames[0].width * frames[0].height * framesLength * 5 );
  var gif = new GifWriter( buffer, frames[0].width, frames[0].height, { loop: 0 } );
  // var pixels = new Uint8Array( frames[0].width * frames[0].height );

  var addFrame = function (frame) {
    var data = frame.data;

    // Make palette with NeuQuant.js
    var nqInPixels = rgba2rgb(data);
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
    // var colorDepth = 8;
    // var palSize = 7;
    // get closest match to transparent color if specified
    // if (transparent != null) {
    //   transIndex = findClosest(transparent);
    // }

    // force palette to be power of 2
    // var powof2 = 1;
    // while ( powof2 < palette.length ) powof2 <<= 1;
    // palette.length = powof2;

    gif.addFrame( 0, 0, frame.width, frame.height, new Uint8Array( map ), { palette: new Uint32Array( palette ), delay: delay } );
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