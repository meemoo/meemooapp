// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  // Thanks to https://github.com/ticky/canvas-dither/blob/master/canvas-image-worker.js
  // Flickr's version was easy to understand but melted with some fps https://github.com/flickr/FlickrDithr/blob/master/dither.js
  function dither(imageData){

    var currentPixel, newPixelColour, err;
    var imageLength = imageData.data.length;
    var imageWidth = imageData.width;

    // Greyscale luminance (sets r pixels to lum of rgb)
    var grey;
    for (var i = 0; i <= imageLength; i += 4) {
      imageData.data[i] = Math.floor(imageData.data[i] * 0.299 + imageData.data[i+1] * 0.587 + imageData.data[i+2] * 0.114);
    }

    for (currentPixel = 0; currentPixel <= imageLength; currentPixel+=4) {
      if (imageData.data[currentPixel] < 129) {
        newPixelColour = 0;
      } else {
        newPixelColour = 255;
      }

      err = Math.floor((imageData.data[currentPixel] - newPixelColour) / 8);
      imageData.data[currentPixel] = newPixelColour;

      imageData.data[currentPixel + 4]  += err;
      imageData.data[currentPixel + 8]  += err;
      imageData.data[currentPixel + (4 * imageWidth) - 4] += err;
      imageData.data[currentPixel + (4 * imageWidth)] += err;
      imageData.data[currentPixel + (4 * imageWidth) + 4] += err;
      imageData.data[currentPixel + (8 * imageWidth)] += err;

      // Set g and b pixels equal to r
      imageData.data[currentPixel + 1] = imageData.data[currentPixel + 2] = imageData.data[currentPixel];
    }

    return imageData;
  }

  Iframework.NativeNodes["image-dither"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "dither",
      author: "ticky",
      description: "atkinson halftone dither thanks to ticky https://github.com/ticky/canvas-dither/blob/master/canvas-image-worker.js"
    },
    initializeModule: function(){
      
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "image") {
        this._image = null;
        this._triggerRedraw = true;
      }
    },
    canvasSettings: function () {
      this.context.fillStyle = this._fill;
      this.context.strokeStyle = this._stroke;
      this.context.lineWidth = this._strokewidth;
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
        var data = dither(imageData);
        this.context.putImageData(data, 0, 0);
      }
      this.inputsend();
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    inputs: {
      image: {
        type: "image",
        description: "image to Atkinson dither"
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
