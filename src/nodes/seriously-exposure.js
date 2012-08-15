/*global Seriously:true*/

// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["seriously-exposure"] = Iframework.NativeNodes["seriously"].extend({

    info: {
      title: "exposure",
      description: "Seriously.js (WebGL) image exposure"
    },
    inputexposure: function (f) {
      this.setParam("exposure", f);
    },
    inputs: {
      image: {
        type: "image",
        description: "input image",
        maxEdges: 1
      },
      exposure: {
        type: "float",
        description: "exposure amount",
        "min": 0,
        "max": 1,
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
