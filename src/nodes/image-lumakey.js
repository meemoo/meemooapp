// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-lumakey"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "lumakey",
      description: "alpha key based on luma"
    },
    initializeModule: function(){
      $(this.canvas).addClass("alpha-bg");
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "image") {
        this._image = null;
        this._triggerRedraw = true;
      }
    },
    redraw: function(){
      // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this._image) {
        if (this.canvas.height !== this._image.height) {
          this.canvas.height = this._image.height;
        }
        if (this.canvas.width !== this._image.width) {
          this.canvas.width = this._image.width;
        }

        this.context.drawImage(this._image, 0, 0, this._image.width, this._image.height);
        var frame = this.context.getImageData(0, 0, this._image.width, this._image.height);
        var len = frame.data.length;

        // Iterate over all pixels in the current frame.
        for (var i = 0; i < len; i+=4) {
          var r = frame.data[i + 0];
          var g = frame.data[i + 1];
          var b = frame.data[i + 2];

          var luma = (0.299*r + 0.587*g + 0.11*b) / 255;

          // alpha zero
          if ( (this._invert ? luma < this._threshold : luma >= this._threshold ) ) {
            frame.data[i + 3] = 0;
          }
        }

        this.context.putImageData(frame, 0, 0);

        this.inputsend();
      }
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    inputs: {
      image: {
        type: "image",
        description: "image to key"
      },
      threshold: {
        type: "float",
        description: "luma value, 0-1",
        "default": 0.8
      },
      invert: {
        type: "boolean",
        description: "checked: cut black; not checked: cut white",
        "default": false
      },
      send: {
        type: "bang",
        description: "send the image"
      }
    },
    outputs: {
      image: {
        type: "image"
      }
    }

  });


});
