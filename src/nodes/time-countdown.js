// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="progressbar"></div>'+
    '<button class="start">start</button>'+
    '<button class="stop">stop</button>'+
    '<div class="info"></div>';

  Iframework.NativeNodes["time-countdown"] = Iframework.NativeNodes["time"].extend({

    template: _.template(template),
    info: {
      title: "countdown",
      description: "countdown to bang"
    },
    events: {
      "click .start": "inputstart",
      "click .stop":  "inputstop"
    },
    initializeModule: function(){
      this.setupProgressbar(".progressbar", 100);
      this.$("button").button();
    },
    inputduration: function(s){
      this._duration = s * 1000;
    },
    _running: false,
    _startme: false,
    inputstart: function(){
      this._startme = true;
    },
    inputstop: function(){
      this._running = false;
    },
    redraw: function(){
    },
    _lastDisplay: "",
    renderAnimationFrame: function (timestamp) {
      if (this._startme) {
        this._start = timestamp;
        this._running = true;
        this._startme = false;
      }
      if (this._running) {
        var delta = timestamp - this._start;
        if (delta <= this._duration) {
          // Only display 1/100 of seconds
          var display = Math.round((this._duration-delta)/10)/100;
          if (display !== this._lastDisplay) {
            this.progress( 100-(delta/this._duration*100) );
            this.$(".info").text(display+"s");
            this._lastDisplay = display;
          }
        } else {
          this.progress(0);
          this.$(".info").text(this._duration/1000+"s");
          this.send("bang", "!");
          this._running = false;
        }
      }
    },
    inputs: {
      duration: {
        type: "float",
        description: "seconds to countdown",
        "default": 3.0
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
      bang: {
        type: "bang"
      }
    }

  });


});
