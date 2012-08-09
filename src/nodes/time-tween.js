/*global TWEEN:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    // '<canvas id="canvas-<%= id %>" class="canvas" width="500" height="500" style="max-width:100%;" />'+
    '<div class="info" />';

  Iframework.NativeNodes["time-tween"] = Iframework.NativeNodes["time"].extend({

    template: _.template(template),
    info: {
      title: "tween",
      description: "interpolate between two values over time"
    },
    initializeModule: function(){
      var self = this;
      if (window.TWEEN) {
        console.log(window.TWEEN);
      } else {
        yepnope({
          load: "libs/Tween.js",
          complete: function () {
            self.initializeModule();
          }
        });
      }
    },
    setupTween: function(){
      //
    },
    inputstart: function(){

    },
    process: function(){
      //
    },
    renderAnimationFrame: function () {
      // Get a tick from GraphView.renderAnimationFrame()
      // this._valueChanged is set by NodeBox.receive()
      if (this._valueChanged) {
        this._valueChanged = false;
        this.setupTween();
      }
      TWEEN.update();
    },
    inputs: {
      from: {
        type: "number",
        description: "start value",
        "default": 0.0
      },
      to: {
        type: "number",
        description: "end value",
        "default": 1.0
      },
      time: {
        type: "number",
        description: "number of seconds",
        "default": 3.0
      },
      type: {
        type: "string",
        description: "Linear Quadratic Cubic Quartic Quintic Sinusoidal Exponential Circular Elastic Back Bounce. For a visual explanation see: http://sole.github.com/tween.js/examples/03_graphs.html",
        options: "Linear Quadratic Cubic Quartic Quintic Sinusoidal Exponential Circular Elastic Back Bounce".split(" "),
        "default": "Sinusoidal"
      },
      ease: {
        type: "string",
        description: "None In Out InOut. For a visual explanation see: http://sole.github.com/tween.js/examples/03_graphs.html",
        options: "None In Out InOut".split(" "),
        "default": "InOut"
      },
      start: {
        type: "bang",
        description: "start tween"
      }
    },
    outputs: {
      image: {
        type: "value"
      }
    }

  });


});
