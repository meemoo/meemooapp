$(function(){

  Iframework.NativeNodes["image-combine"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "image-combine",
      description: "native module test"
    },
    inputimage: function (image) {
      // console.log(image.constructor === ImageData);
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
