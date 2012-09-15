// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  // Atkinson thanks to https://github.com/ticky/canvas-dither/blob/master/canvas-image-worker.js
  // Flickr's Atkinson was easy to understand but melted with some fps https://github.com/flickr/FlickrDithr/blob/master/dither.js
  // Bayer parsed from http://en.wikipedia.org/wiki/Ordered_dithering

  var bayerMap = [
    [  1,  9,  3, 11 ],
    [ 13,  5, 15,  7 ],
    [  4, 12,  2, 10 ],
    [ 16,  8, 14,  6 ]
  ];

  var bayerThresholdMap = [
    [  15, 135,  45, 165 ],
    [ 195,  75, 225, 105 ],
    [  60, 180,  30, 150 ],
    [ 240, 120, 210,  90 ]
  ];

  var lumR = [];
  var lumG = [];
  var lumB = [];
  for (var i=0; i<256; i++) {
    lumR[i] = i*0.299;
    lumG[i] = i*0.587;
    lumB[i] = i*0.114;
  }

  function monochrome(imageData, threshold, type){

    var imageDataLength = imageData.data.length;

    // Greyscale luminance (sets r pixels to luminance of rgb)
    for (var i = 0; i <= imageDataLength; i += 4) {
      imageData.data[i] = Math.floor(lumR[imageData.data[i]] + lumG[imageData.data[i+1]] + lumB[imageData.data[i+2]]);
    }

    var w = imageData.width;
    var newPixel, err;

    for (var currentPixel = 0; currentPixel <= imageDataLength; currentPixel+=4) {

      if (type === "none") {
        // No dithering
        imageData.data[currentPixel] = imageData.data[currentPixel] < threshold ? 0 : 255;
      } else if (type === "bayer") {
        // 4x4 Bayer ordered dithering algorithm
        var x = currentPixel/4 % w;
        var y = Math.floor(currentPixel/4 / w);
        var map = Math.floor( (imageData.data[currentPixel] + bayerThresholdMap[x%4][y%4]) / 2 );
        imageData.data[currentPixel] = (map < threshold) ? 0 : 255;
      } else if (type === "floydsteinberg") {
        // Floyd–Steinberg dithering algorithm
        newPixel = imageData.data[currentPixel] < 129 ? 0 : 255;
        err = Math.floor((imageData.data[currentPixel] - newPixel) / 16);
        imageData.data[currentPixel] = newPixel;

        imageData.data[currentPixel       + 4 ] += err*7;
        imageData.data[currentPixel + 4*w - 4 ] += err*3;
        imageData.data[currentPixel + 4*w     ] += err*5;
        imageData.data[currentPixel + 4*w + 4 ] += err*1;
      } else {
        // Bill Atkinson's dithering algorithm
        newPixel = imageData.data[currentPixel] < threshold ? 0 : 255;
        err = Math.floor((imageData.data[currentPixel] - newPixel) / 8);
        imageData.data[currentPixel] = newPixel;

        imageData.data[currentPixel       + 4 ] += err;
        imageData.data[currentPixel       + 8 ] += err;
        imageData.data[currentPixel + 4*w - 4 ] += err;
        imageData.data[currentPixel + 4*w     ] += err;
        imageData.data[currentPixel + 4*w + 4 ] += err;
        imageData.data[currentPixel + 8*w     ] += err;
      }

      // Set g and b pixels equal to r
      imageData.data[currentPixel + 1] = imageData.data[currentPixel + 2] = imageData.data[currentPixel];
    }

    return imageData;
  }

  Iframework.NativeNodes["image-monochrome"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "monochrome",
      author: "ticky+flickr+forresto",
      description: "monochrome by atkinson, bayer, floydsteinberg, or no dither"
    },
    initializeModule: function(){
      // Don't do max-width:100%, messes up look of dither
      $(this.canvas).attr({
        "style": ""
      });
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "image") {
        this._image = null;
        this._triggerRedraw = true;
      }
    },
    inputthreshold: function(f){
      this._threshold = Math.floor(f*255);
      this._triggerRedraw = true;
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (this._image) {
        if (this.canvas.height !== this._image.height) {
          this.canvas.height = this._image.height;
        }
        if (this.canvas.width !== this._image.width) {
          this.canvas.width = this._image.width;
        }
        var imageData = this._image.getContext('2d').getImageData(0,0, this._image.width, this._image.height);
        var data = monochrome(imageData, this._threshold, this._type);
        this.context.putImageData(data, 0, 0);
      }
      this.inputsend();
    },
    inputs: {
      image: {
        type: "image",
        description: "image to dither"
      },
      type: {
        type: "string",
        description: '"atkinson" is like Mac, "bayer" is like Gameboy, "floydsteinberg" is normal dithering, "none" is black and white with no dithering',
        options: "atkinson bayer floydsteinberg none".split(" "),
        "default": "atkinson"
      },
      threshold: {
        type: "float",
        description: "percentage grey to go black",
        min: 0,
        max: 1,
        "default": 0.5
      },
      send: {
        type: "bang",
        description: "send the combined canvas"
      }
    },
    outputs: {
      image: {
        type: "image"
      }
    }

  });


});
