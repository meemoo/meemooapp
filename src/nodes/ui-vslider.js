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
    initializeModule: function(){
      var self = this;
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
          step: this._step === 0 ? 0.001 : this._step,
          slide: function(e, ui){
            self._value = ui.value;
            self.sendValue();
          }
        })
        .css({
          height: this.$el.height()-30
        });
      this.$el.css({
        overflow: "hidden"
      });
    },
    inputvalue: function(val){
      this._value = val;
      this.$(".slider").slider({
        value: this._value
      });
      this.sendValue();
    },
    sendValue: function(){
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
        description: "manual input value; sets default"
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
