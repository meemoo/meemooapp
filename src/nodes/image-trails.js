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
        }
        if (this.canvas.height !== this._image.height) {
          this.canvas.height = this._image.height;
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
