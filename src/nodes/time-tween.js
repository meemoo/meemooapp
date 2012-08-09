// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<canvas id="canvas-<%= id %>" class="canvas" width="500" height="500" style="max-width:100%;" />'+
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
    process: function(){
      //
    },
    renderAnimationFrame: function () {
      // Get a tick from GraphView.renderAnimationFrame()
      // this._valueChanged is set by NodeBox.recieve()
      if (this._valueChanged) {
        this._valueChanged = false;
        this.process();
      }
    },
    inputs: {
      from: {
        type: "number",
        description: "start value",
        "default": 0
      },
      to: {
        type: "number",
        description: "end value",
        "default": 1
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
