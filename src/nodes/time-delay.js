// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["time-delay"] = Iframework.NativeNodes["time"].extend({

    info: {
      title: "delay",
      description: "holds x values until the next one comes"
    },
    initializeModule: function(){
    },
    _data: [],
    inputdata: function (data) {
      this._data.unshift(data);
      if (this._data.length >= this._hold) {
        this.send("data", this._data.pop());
      }
    },
    inputhold: function (hold) {
      this.$(".info").text(hold);
      this._hold = hold;
      if (this._data.length >= this._hold) {
        this._data = this._data.slice(0, hold);
      }
    },
    inputs: {
      data: {
        type: "all",
        description: "data to hold"
      },
      hold: {
        type: "int",
        description: "how long to hold the value",
        "default": 1
      }
    },
    outputs: {
      data: {
        type: "all"
      }
    }

  });


});
