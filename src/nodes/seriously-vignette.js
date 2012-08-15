/*global Seriously:true*/

// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["seriously-vignette"] = Iframework.NativeNodes["seriously"].extend({

    info: {
      title: "vignette",
      description: "Seriously.js (WebGL) image vignette"
    },
    inputamount: function (f) {
      this.setParam("amount", f);
    },
    inputs: {
      image: {
        type: "image",
        description: "input image",
        maxEdges: 1
      },
      amount: {
        type: "float",
        description: "vignette amount",
        "min": 0,
        "default": 1
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
