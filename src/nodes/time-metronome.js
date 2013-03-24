// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="blinklights">stopped</div>'+
    '<div class="info"></div>'+
    '<button class="start">start</button>'+
    '<button class="stop">stop</button>';

  Iframework.NativeNodes["time-metronome"] = Iframework.NativeNodes["time"].extend({

    template: _.template(template),
    info: {
      title: "metronome",
      description: "metronome tick tock"
    },
    events: {
      "click .start" : "inputstart",
      "click .stop"  : "inputstop"
    },
    initializeModule: function(){
    },
    _ms: 500,
    inputbpm: function(bpm){
      var restart = false;
      if (this._interval) {
        window.clearInterval(this._interval);
        restart = true;
      }
      this._ms = 1000 / bpm * 60;
      this.$(".info").text(bpm+"bpm, "+Math.round(this._ms*100)/100+"ms");
      if (restart){
        this.inputstart();        
      }
    },
    _interval: null,
    inputstart: function(){
      if (this._interval) {
        window.clearInterval(this._interval);
      }
      var self = this;
      this._interval = window.setInterval(function(){
        self.sendbeat();
      }, this._ms);
      this.$(".blinklights").text("started");
    },
    inputstop: function(){
      if (this._interval) {
        window.clearInterval(this._interval);
      }
      this.$(".blinklights").text("stopped");
    },
    sendbeat: function(){
      this.send("bang", "!");      
    },
    remove: function(){
      if (this._interval) {
        window.clearInterval(this._interval);
      }
    },
    inputs: {
      bpm: {
        type: "float",
        description: "beats per minute",
        "default": 120
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
