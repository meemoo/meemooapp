// extends src/nodes/util.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["util-gate"] = Iframework.NativeNodes["util"].extend({

    info: {
      title: "gate",
      description: "stop the data flow and let one through"
    },
    initializeModule: function(){
    },
    inputdata: function(data){
      if (this._open) {
        this.send("data", data);        
      } else if (this._one) {
        this.send("data", data);        
        this._one = false;
      }
    },
    _one: false,
    inputone: function(){
      this._one = true;
    },
    _open: false,
    inputopen: function(b){
      this._open = b;
      this.$(".info").text( b ? "open" : "closed" );
    },
    redraw: function(timestamp){
    },
    inputs: {
      data: {
        type: "all",
        description: "data to gate"
      },
      open: {
        type: "boolean",
        description: "let all data through",
        "default": false
      },
      one: {
        type: "bang",
        description: "let the next data through"
      }
    },
    outputs: {
      data: {
        type: "all"
      }
    }

  });


});
