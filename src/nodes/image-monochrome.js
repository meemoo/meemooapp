// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-monochrome"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "monochrome",
      author: "ticky+flickr+forresto",
      description: "monochrome by atkinson, bayer, floydsteinberg, or no dither"
    },
    initializeModule: function(){
      var self = this;
      this._worker = new Worker('src/nodes/image-monochrome-worker.js');
      this._worker.addEventListener('message', function (e) {
        self.context.putImageData(e.data, 0, 0);
        self._workerBusy = false;
      }, false);
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
      if (this._image && this._worker && !this._workerBusy) {
        if (this.canvas.height !== this._image.height) {
          this.canvas.height = this._image.height;
        }
        if (this.canvas.width !== this._image.width) {
          this.canvas.width = this._image.width;
        }
        var imageData = this._image.getContext('2d').getImageData(0,0, this._image.width, this._image.height);        
        // var data = monochrome(imageData, this._threshold, this._type);
        // this.context.putImageData(data, 0, 0);
        this._worker.postMessage({
          imageData: imageData,
          threshold: this._threshold,
          type: this._type
        });
        // Don't process a new frame until this one is done
        this._workerBusy = true;
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
