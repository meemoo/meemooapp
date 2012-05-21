$(function(){

  Iframework.NativeNodeImageBase = Iframework.NativeNodeBase.extend({
    type: "image"
  });

  Iframework.NativeNodes["image-combine"] = Iframework.NativeNodeImageBase.extend({

    info: {
      title: "image-combine",
      description: "native module test"
    },
    inputimage: function (i) {
      console.log(this, i, Meemoo);
    },
    inputbang: function (i) {
      this.send("bang", i);
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
