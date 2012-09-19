/*global TWEEN:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    // '<canvas id="canvas-<%= id %>" class="canvas" width="180" height="100" style="max-width:100%;" />'+
    '<img id="view-<%= id %>" class="tween-view" width="180" height="100" style="max-width:100%;" />'+
    '<div><span class="function"></span> <span class="loop"></span></div>'+
    '<div class="info">from:<span class="tween-in"></span>, to:<span class="tween-out"></span>, duration:<span class="tween-duration"></span></div>'+
    '<div class="progressbar"></div>'+
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
        // this.setupTween();
      } else {
        yepnope({
          load: "libs/Tween.js",
          complete: function () {
            self.initializeModule();
          }
        });
      }
      // this.progressbar(".progressbar");
    },
    _tween: null,
    _tweenVals: {},
    setupTween: function(){
      var ease = this._ease;
      if (this._type === "Linear" && this._ease !== "None") {
        ease = "None";
      }
      if (this._type !== "Linear" && this._ease === "None") {
        ease = "InOut";
      }
      if (!!window.TWEEN && TWEEN.Easing.hasOwnProperty(this._type) && TWEEN.Easing[this._type].hasOwnProperty(ease)) {
        // Restart tween if currently playing
        var restart = false;
        if (this._tween && this._tween.playing) {
          // Stop if exists
          this.inputstop();
          restart = true;
        }

        var tweeningFunction = TWEEN.Easing[this._type][ease];

        this.$(".function").text(this._type+"."+ease);
        this.$(".tween-in").text(this._from);
        this.$(".tween-out").text(this._to);
        this.$(".tween-duration").text(this._duration);
        this.$(".tween-view").attr({src:"libs/Tween/"+this._type+"."+ease+".png"});

        this._tweenVals.x = this._reversing ? this._to : this._from;
        var self = this;
        this._tween = new TWEEN.Tween( self._tweenVals )
          .to( { x: (self._reversing ? self._from : self._to) }, self._duration*1000 )
          .easing( tweeningFunction )
          .onComplete( function () {
            self.send("complete", "!");
            self.inputstop();
            // Reverse or loop if set
            self.loop();
          });

        if (restart) {
          // Restart
          this.inputstart();
        }
      }
    },
    _reversing: false,
    reverse: function(){
      this._reversing = !this._reversing;
      this.setupTween();
      this.inputstart();
    },
    loop: function(){
      // Reverse, loop, or stop
      if (this._pingpong) {
        this.reverse();
      } else if (this._loop) {
        this.inputstart();
      }
    },
    _deferStart: false,
    inputstart: function(){
      if (!window.TWEEN) {
        this._deferStart = true;
        return;
      }
      if (!this._tween) {
        this.setupTween();
      }
      if (this._tween) {
        // Reset
        this._tweenVals.x = this._reversing ? this._to : this._from;
        this._tween.start();
        this._tween.playing = true;
      }
    },
    inputstop: function(){
      if (this._tween) {
        this._tween.stop();
        this._tween.playing = false;
      }
    },
    inputpingpong: function(boo){
      this._pingpong = boo;
      if (boo) {
        this.$(".loop").text("(pingpong)");
      } else {
        this.$(".loop").text(this._loop ? "(loop)" : "");
      }
    },
    inputloop: function(boo){
      this._loop = boo;
      if (!this._pingpong) {
        if (boo) {
          this.$(".loop").text("(loop)");
        } else {
          this.$(".loop").text("");
        }
      }
    },
    _lastDisplay: "",
    redraw: function(){
      // Only display to .00001
      var display = Math.round(this._tweenVals.x*100000)/100000;
      if (display !== this._lastDisplay) {
        this.$(".tween-value").text(display);
        this._lastDisplay = display;
      }
    },
    renderAnimationFrame: function (timestamp) {
      // Get a tick from GraphView.renderAnimationFrame()
      // this._valueChanged is set by NodeBox.receive()
      if (this._triggerRedraw) {
        // Changing settings sets up a new tween
        if (window.TWEEN) {
          this._triggerRedraw = false;
          this.setupTween();
          if (this._deferStart) {
            this._deferStart = false;
            this.inputstart();
          }
        }
      }
      if (!!window.TWEEN && this._tween && this._tween.playing) {
        this._tween.update(timestamp);
        if (this._lastValue !== this._tweenVals.x) {
          this.send("value", this._tweenVals.x);
          this.redraw();
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
      loop: {
        type: "boolean",
        description: "restart the tween on completion"
      },
      pingpong: {
        type: "boolean",
        description: "reverse the tween on completion"
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
