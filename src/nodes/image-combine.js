$(function(){

  Iframework.NativeNodes["image-combine"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "image-combine",
      description: "native module test"
    },
    inputimage: function (image) {
      // This should happen in port eventually
      switch(Iframework.util.type(image)) {
        case "ImageData" :
          this.context.putImageData(image, 0, 0);
          break;
        case "HTMLCanvasElement" :
          this.context.drawImage(image, 0, 0);
          break;
        default :
          break;
      }
      this.send("image", this.canvas);
    },
    renderAnimationFrame: function () {
      //
    },
    inputbang: function (i) {
      this.$(".info").append("! ");
      this.send("bang", "!");
    },
    inputs: {
      image: {
        type: "image"
      },
      bang: {
        type: "bang"
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
