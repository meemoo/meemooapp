/*global TWEEN:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var timeNow = function () {
    return window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();
  };

  var template = 
    '<img title="drag to move playhead" id="view-<%= id %>" class="tween-view" width="180" height="100" style="width:100%" />'+
    '<span class="tween-progress" style="position:absolute; left:0px; top:20px; height:60px; border-left:1px solid blue;"></span>'+
    '<span title="tween to" class="tween-out" style="position:absolute; right:0; top:2px;"></span>'+
    '<span title="tween from" class="tween-in" style="position:absolute; left:0; top:83px; max-width:45%; overflow:hidden;"></span>'+
    '<span title="duration" class="tween-duration" style="position:absolute; right:0; top:83px; max-width:45%; overflow:hidden;"></span>'+
    '<button class="start">start</button>'+
    '<button class="stop">stop</button>'+
    '<div><span class="function"></span> <span class="loop"></span></div>'+
    '<div class="tween-value" style="max-width:100%; overflow:hidden;"></div>';

  Iframework.NativeNodes["time-tween"] = Iframework.NativeNodes["time"].extend({

    template: _.template(template),
    info: {
      title: "tween",
      description: "interpolate between two values over time"
    },
    events: {
      "click .start": "inputstart",
      "click .stop":  "inputstop"
    },
    initializeModule: function(){
      this.tween = {};

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

      var startDragX;
      var startWidth;
      var startPercent;
      var startPlaying;
      var tweenView = this.$(".tween-view");
      tweenView.draggable({
        cursor: "e-resize",
        helper: function () {
          var helper = $("<div></div>");
          $(document.body).append(helper);
          return helper;
        },
        start: function (event, ui) {
          if (self.tween) {
            startDragX = ui.position.left;
            startWidth = tweenView.width();
            startPercent = self.tween.percent;
            startPlaying = self.tween.playing;
            self.tween.playing = false;
          }
        },
        drag: function (event, ui) {
          if (self.tween) {
            var diff = ui.position.left - startDragX;
            var p = startPercent + diff/startWidth;
            p = Math.min(1,p);
            p = Math.max(0,p);
            self.gotoPercent( p );
          }
        },
        stop: function (event, ui) {
          if (self.tween) {
            self.tween.playing = startPlaying;
          }
        }
      });
      // Drag through
      this.$('.tween-progress').mousedown( function (event) {
        tweenView.trigger(event);
      });
    },
    _resetTween: false,
    setupTween: function(){
      var ease = this._ease;
      if (this._type === "Linear" && this._ease !== "None") {
        ease = "None";
      }
      if (this._type !== "Linear" && this._ease === "None") {
        ease = "InOut";
      }
      if (window.TWEEN) {

        if (!TWEEN.Easing.hasOwnProperty(this._type)) {
          this._type = "Sinusoidal";
        }
        if (!TWEEN.Easing[this._type].hasOwnProperty(ease)) {
          ease = (this._type==="Linear") ? "None" : "InOut";
        }

        this.$(".function").text(this._type+"."+ease);
        this.$(".tween-in").text(this._from);
        this.$(".tween-out").text(this._to);
        this.$(".tween-duration").text(this._duration/1000+"s");
        this.$(".tween-view").attr({src:"libs/Tween/"+this._type+"."+ease+".png"});

        this.tween.easing = TWEEN.Easing[this._type][ease];
        this.tween.value = this._from;
        this.tween.percent = this._percent !== undefined ? this._percent : 0;
        this._resetTween = false;
      }
    },
    inputtype: function (type) {
      this._type = type;
      this._resetTween = true;
    },
    inputease: function (ease) {
      this._ease = ease;
      this._resetTween = true;
    },
    inputfrom: function (from) {
      this._from = from;
      this._resetTween = true;
    },
    inputto: function (to) {
      this._to = to;
      this._resetTween = true;
    },
    inputduration: function (duration) {
      this._duration = duration*1000;
      this._resetTween = true;
    },
    inputpingpong: function(boo){
      this._pingpong = boo;
      if (boo) {
        this.$(".loop").text("(pingpong)");
      } else {
        this._reversing = false;
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
    _reversing: false,
    reverse: function(){
      this._reversing = !this._reversing;
      this.inputstart();
    },
    loop: function(){
      // Reverse, loop, or stop
      if (this._pingpong) {
        this.reverse();
      } else if (this._loop) {
        this.inputstart();
      } else {
        this.inputstop();
        this.send("complete", true);
      }
    },
    _deferStart: false,
    inputstart: function(){
      if (!window.TWEEN) {
        this._deferStart = true;
        return;
      }
      if (!this.tween) {
        this.setupTween();
      }
      if (this.tween) {
        // Reset
        this.tween.start = timeNow();
        this.tween.playing = true;
      }
    },
    inputstop: function(){
      if (this.tween) {
        this.tween.playing = false;
      }
      this._reversing = false;
    },
    gotoPercent: function (p) {
      if (this.tween && this.tween.easing) {
        this.tween.percent = p;
        this.tween.value = this._from + ( this._to - this._from ) * this.tween.easing(p);
        this.send("value", this.tween.value);
        this._triggerRedraw = true;
      }
    },
    inputpercent: function(p){
      this.inputstop();
      if (p>1){
        p %= 1;
      }
      this._percent = p;
      this.gotoPercent(p);
    },
    redraw: function(){
      if (this.tween) {
        this.$(".tween-value").text( Math.round(this.tween.value*100000000)/100000000 );
        this.$(".tween-progress").css("left", (this.tween.percent*96+2)+"%");
      }
    },
    renderAnimationFrame: function (timestamp) {
      // Get a tick from GraphView.renderAnimationFrame()
      if (this._resetTween) {
        // Changing settings sets up a new tween
        if (window.TWEEN) {
          this.setupTween();
          if (this._deferStart) {
            this._deferStart = false;
            this.inputstart();
          }
        }
      }
      if (window.TWEEN && this.tween && this.tween.playing) {
        var p = (timeNow() - this.tween.start) / this._duration;
        if (p>1) {
          p = 1;
        }
        this.gotoPercent( (this._reversing ? 1-p : p) );
        if (p>=1) {
          this.loop();
        }
      }
      if (this._triggerRedraw) {
        this.redraw();
        this._triggerRedraw = false;
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
      percent: {
        type: "float",
        description: "skip to percent of tween",
        "default": 0,
        min: 0,
        max: 1
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
