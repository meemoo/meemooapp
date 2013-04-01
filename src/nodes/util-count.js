// extends src/nodes/util.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["util-count"] = Iframework.NativeNodes["util"].extend({

    info: {
      title: "count",
      description: "count the times that the data input is hit"
    },
    initializeModule: function(){
    },
    _count: 0,
    inputdata: function(){
      this._count += this._increment;
      this.send("count", this._count);
      this._triggerRedraw = true;
    },
    inputfrom: function(from){
      this._count = from;
      this._triggerRedraw = true;
    },
    _increment: 1,
    redraw: function(timestamp){
      this.$(".info").text(this._count);
    },
    inputs: {
      data: {
        type: "all",
        description: "data to count"
      },
      from: {
        type: "float",
        description: "from where to count, 0 to reset",
        "default": 0
      },
      increment: {
        type: "float",
        description: "1 to count up, -1 to count down",
        "default": 1
      }
    },
    outputs: {
      count: {
        type: "float"
      }
    }

  });


});
