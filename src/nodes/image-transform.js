// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-transform"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "transform",
      description: "scale, translate, and/or rotate image"
    },
    initializeModule: function(){
      // this.showResizer(20,20,0.5);
    },
    _backgroundChanged: false,
    inputbackground: function (image) {
      this._background = image;
      this._backgroundChanged = true;
      this._triggerRedraw = true;
    },
    inputrotate: function (percent) {
      this._rotate = percent * 2 * Math.PI;
      this._triggerRedraw = true;
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "background") {
        this._background = null;
        this._triggerRedraw = true;
      }
      if (edge.Target.id === "image") {
        this._image = null;
        this._triggerRedraw = true;
      }
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this._background) {
        if (this._backgroundChanged && (this.canvas.width !== this._background.width || this.canvas.height !== this._background.height)) {
          this.canvas.width = this._background.width;
          this.canvas.height = this._background.height;
          this._backgroundChanged = false;
        }
        this.context.drawImage(this._background, 0, 0);
      }
      if (this._image) {
        var width = this._image.width * this._scale;
        var height = this._image.height * this._scale;
        var x = this.canvas.width/2 + this._translateX;
        var y = this.canvas.height/2 + this._translateY;

        // context.save();
        this.context.translate(x, y);
        this.context.rotate(this._rotate);
        this.context.drawImage(this._image, -width/2, -height/2, width, height);
        // context.restore();
        this.context.rotate(-this._rotate);
        this.context.translate(-x, -y);
      }

      this.inputsend();
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    inputs: {
      background: {
        type: "image",
        description: "background image"
      },
      image: {
        type: "image",
        description: "image to center and transform"
      },
      scale: {
        type: "float",
        description: "scale percentage",
        "default": 1.0
      },
      translateX: {
        type: "float",
        description: "translate x pixels",
        "default": 0
      },
      translateY: {
        type: "float",
        description: "translate y pixels",
        "default": 0
      },
      rotate: {
        type: "float",
        description: "rotate percentage",
        "default": 0
      },
      // clear: {
      //   type: "bang",
      //   description: "clear the canvas"
      // },
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
