/*global Stats:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="slider" style="position:absolute; top:15px;left:15px;"></div>'+
    '<div class="info" style="position:absolute; top:15px;left:45px;" />';

  Iframework.NativeNodes["ui-vslider"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "vslider",
      description: "vertical slider"
    },
    events: {
      "slide .slider": "slide"
    },
    initializeModule: function(){
      if (this._value === undefined) { this._value = 0; }
      if (this._min === undefined) { this._min = 0; }
      if (this._max === undefined) { this._max = 1; }
      if (this._step === undefined) { this._step = 0; }
      this.$(".slider")
        .slider({
          orientation: "vertical",
          value: this._value,
          min: this._min,
          max: this._max,
          step: this._step === 0 ? 0.001 : this._step
        });
      this.$el.css({
        overflow: "hidden"
      });

      var self = this;
      _.delay(function(){
        self.resize();
      }, 100);
    },
    slide: function (event, ui) {
      this.setValue(ui.value);
      this.inputsend();
    },
    inputvalue: function(val){
      this.setValue(val);
      this.$(".slider").slider({
        value: val
      });
      this.inputsend();
    },
    setValue: function(val){
      this._value = val;
      this.$(".info").text(this._value);      
    },
    inputsend: function(){
      this.send("value", this._value);
      this.$(".info").text(this._value);
    },
    redraw: function(){
      // Actually just sets up the slider again
      this.initializeModule();
    },
    resize: function(){
      this.$(".slider")
        .css({
          height: this.$el.height()-30
        });
    },
    inputs: {
      value: {
        type: "float",
        description: "manual input value; sets default",
        "default": 0
      },
      min: {
        type: "float",
        description: "slider jumps values",
        "default": 0
      },
      max: {
        type: "float",
        "default": 1
      },
      step: {
        type: "float",
        description: "slider jumps by this amount",
        "default": 0
      }
    },
    outputs: {
      value: {
        type: "float"
      }
    }

  });


});
