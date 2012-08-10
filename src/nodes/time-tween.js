/*global TWEEN:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    // '<canvas id="canvas-<%= id %>" class="canvas" width="500" height="500" style="max-width:100%;" />'+
    '<div class="function"></div>'+
    '<div class="info">from:<span class="tween-in"></span>, to:<span class="tween-out"></span>, duration:<span class="tween-duration"></span></div>'+
    '<div class="tween-value"></div>';

  Iframework.NativeNodes["time-tween"] = Iframework.NativeNodes["time"].extend({

    template: _.template(template),
    info: {
      title: "tween",
      description: "interpolate between two values over time"
    },
    initializeModule: function(){
      var self = this;
      if (window.TWEEN) {
        this.inputstart();
      } else {
        yepnope({
          load: "libs/Tween.js",
          complete: function () {
            self.initializeModule();
          }
        });
      }
    },
    _tween: null,
    _tweenVals: {},
    setupTween: function(){
      if (this._type === "Linear" && this._ease !== "None") {
        this._ease = "None";
      }
      if (!!window.TWEEN && TWEEN.Easing.hasOwnProperty(this._type) && TWEEN.Easing[this._type].hasOwnProperty(this._ease)) {
        // Stop if exists
        // this.inputstop();

        var tweeningFunction = TWEEN.Easing[this._type][this._ease];

        this.$(".function").text(this._type+"."+this._ease);
        this.$(".tween-in").text(this._from);
        this.$(".tween-out").text(this._to);
        this.$(".tween-duration").text(this._duration);

        this._tweenVals.x = this._from;
        var self = this;
        this._tween = new TWEEN.Tween( this._tweenVals )
          .to( { x: this._to }, this._duration*1000 )
          .easing( tweeningFunction )
          .onComplete( function () {
            self.send("complete", "!");
            self.inputstop();
          });
      }
    },
    inputstart: function(){
      if (!this._tween) {
        this.setupTween();
      }
      if (this._tween) {
        this._tween.start();
      }
    },
    inputstop: function(){
      if (this._tween) {
        this._tween.stop();
        // this._tween = null;
      }
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
      if (!!window.TWEEN && this._tween && this._tweenVals.x) {
        TWEEN.update();
        if (this._lastValue !== this._tweenVals.x) {
          this.$(".tween-value").text(this._tweenVals.x);
          this.send("value", this._tweenVals.x);
        }
        this._lastValue = this._tweenVals.x;
      }
    },
    inputs: {
      from: {
        type: "float",
        description: "start value",
        "default": 0.0
      },
      to: {
        type: "float",
        description: "end value",
        "default": 1.0
      },
      duration: {
        type: "float",
        description: "number of seconds",
        "default": 5.0
      },
      type: {
        type: "string",
        description: "Linear Quadratic Cubic Quartic Quintic Sinusoidal Exponential Circular Elastic Back Bounce. For a visual explanation see: http://sole.github.com/tween.js/examples/03_graphs.html",
        options: "Linear Quadratic Cubic Quartic Quintic Sinusoidal Exponential Circular Elastic Back Bounce".split(" "),
        "default": "Sinusoidal"
      },
      ease: {
        type: "string",
        description: "In, Out, or InOut for all except Linear, which is None. For a visual explanation see: http://sole.github.com/tween.js/examples/03_graphs.html",
        options: "None In Out InOut".split(" "),
        "default": "InOut"
      },
      start: {
        type: "bang",
        description: "start tween"
      },
      stop: {
        type: "bang",
        description: "stop tween"
      }
    },
    outputs: {
      complete: {
        type: "bang"
      },
      value: {
        type: "float"
      }
    }

  });


});
