// extends src/nodes/util.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["time-smooth"] = Iframework.NativeNodes["time"].extend({

    info: {
      title: "smooth",
      description: "smooth changes in numbers"
    },
    initializeModule: function(){
    },
    _active: false,
    _in: 0,
    _out: 0,
    inputnumber: function(number){
      this._active = true;
      this._in = number;
      this._inR = Math.round(number*100000)/100000;
    },
    _last: 0,
    renderAnimationFrame: function (timestamp) {
      // Get a tick from GraphView.renderAnimationFrame()
      if (this._active) {
        this._out += (this._in - this._out) * this._speed;
        var rounded = Math.round(this._out*100000)/100000;
        this.send("number", rounded);
        if (rounded === this._inR) {
          this._active = false;
        }
      }
    },
    redraw: function(timestamp){
      this.$(".info").text(this._count);
    },
    inputs: {
      number: {
        type: "float",
        description: "number to smooth"
      },
      speed: {
        type: "float",
        description: "percent per frame",
        "default": 0.1
      }
    },
    outputs: {
      number: {
        type: "float"
      }
    }

  });


});
