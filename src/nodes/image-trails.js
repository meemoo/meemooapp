// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-trails"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "trails",
      description: "draws image without clearing, leaving motion trails"
    },
    initializeModule: function(){
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "image") {
        this._image = null;
      }
    },
    inputcomposite: function (mode) {
      this._composite = mode;
      var oldmode = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = mode;
      if (this.context.globalCompositeOperation !== mode) {
        this.$(".info").text("globalCompositeOperation '"+mode+"' not supported in this browser");
      }
    },
    _clear: false,
    inputclear: function(){
      this._clear = true;
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (this._clear) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._clear = false;
      }
      if (this._image) {
        if (this.canvas.width !== this._image.width) {
          this.canvas.width = this._image.width;
          this.context.globalCompositeOperation = this._composite;
        }
        if (this.canvas.height !== this._image.height) {
          this.canvas.height = this._image.height;
          this.context.globalCompositeOperation = this._composite;
        }
        this.context.drawImage(this._image, 0, 0);
        this.inputsend();
      }
    },
    inputs: {
      image: {
        type: "image",
        description: "image to stack"
      },
      composite: {
        type: "string",
        description: "composite (source-over, source-in, source-out, source-atop, destination-over, destination-in, destination-out, destination-atop, lighter, darker, copy, xor) and/or blend mode (Firefox 20 only as of April 2013: normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion, hue, saturation, color, luminosity) ",
        options: ['source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop', 'lighter', 'darker', 'copy', 'xor', 
          'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'],
        "default": "source-over"
      },
      clear: {
        type: "bang",
        description: "send the image"
      },
      send: {
        type: "bang",
        description: "send the image"
      }
    },
    outputs: {
      image: {
        type: "image",
        description: "image with trails"
      }
    }

  });


});
