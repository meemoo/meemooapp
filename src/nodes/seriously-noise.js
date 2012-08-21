/*global Seriously:true*/

// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["seriously-noise"] = Iframework.NativeNodes["seriously"].extend({

    info: {
      title: "noise",
      description: "Seriously.js (WebGL) image noise"
    },
    inputamount: function (f) {
      this.setParam("amount", f);
    },
    inputtimer: function (f) {
      this.setParam("timer", f);
    },
    inputs: {
      image: {
        type: "image",
        description: "input image",
        maxEdges: 1
      },
      amount: {
        type: "float",
        description: "noise amount",
        "min": 0,
        "max": 1,
        "default": 0.2
      },
      timer: {
        type: "int",
        description: "timer to change noise",
        "default": 0
      },
      send: {
        type: "bang",
        description: "send the processed canvas"
      }
    },
    outputs: {
      image: {
        type: "image"
      }
    }

  });


});
