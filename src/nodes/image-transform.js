// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-transform"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "image-transform",
      description: "scale, translate, and/or rotate image"
    },
    initializeModule: function(){
      
    },
    inputbackground: function (image) {
      this._background = image;
    },
    inputimage: function (image) {
      this._image = image;
      this.process();
      // // This should happen in port eventually
      // switch(Iframework.util.type(image)) {
      //   case "ImageData" :
      //     this.context.putImageData(image, 0, 0);
      //     break;
      //   case "HTMLCanvasElement" :
      //     this.context.drawImage(image, 0, 0);
      //     break;
      //   default :
      //     break;
      // }
      // this.send("image", this.canvas);
    },
    process: function(){
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

      this.send("image", this.canvas);
    },
    renderAnimationFrame: function () {
      // this.process();
    },
    inputbang: function (i) {
      this.$(".info").append("! ");
      this.send("bang", "!");
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
      clear: {
        type: "bang",
        description: "clear the canvas"
      },
      send: {
        type: "bang",
        description: "send the image"
      }
    },
    outputs: {
      image: {
        type: "image"
      },
      bang: {
        type: "bang"
      }
    }

  });


});
