/*global Leap:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="info"></div>'+
    '<label><input type="checkbox" class="active" checked /> active</label>';

  Iframework.NativeNodes["ui-leap"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "leap",
      description: "leap motion hand tracker"
    },
    events: {
      "change .active": "changeActive"
    },
    initializeModule: function(){
      var self = this;
      // Load lib
      if (window.Leap) {
        Leap.loop(function(frame) {
          if (self._active){
            self.gotLeap(frame);
          }
        });
      } else {
        yepnope({
          load: "libs/leap.js",
          complete: function () {
            self.initializeModule();
          }
        });
      }
    },
    _active: true,
    changeActive: function(event){
      if (event.target.checked) {
        this._active = true;
      } else {
        this._active = false;
      }
    },
    gotLeap: function(frame){
      for (var i=0; i < frame.hands.length && i<2; i++) {
        var hand = frame.hands[i];
        var position = hand.palmPosition;
        this.send("hand"+i+"x", position[0]);
        this.send("hand"+i+"y", position[1]);
        this.send("hand"+i+"z", position[2]);
      }
      for (i = 0; i < frame.pointables.length && i<2; i++) {
        var pointable = frame.pointables[i];
        if (pointable.direction) {
          var angle = Math.atan2(pointable.direction[2], pointable.direction[0]);
          angle = angle / (Math.PI*2) - 0.25;
          this.send("pointer"+i+"xz", angle);
        }
      }
    },
    outputs: {
      hand0x: {
        type: "float",
        description: "x left (-300) to right (300) of hand0 position"
      },
      hand0y: {
        type: "float",
        description: "y down(80) to up(900) of hand0 position"
      },
      hand0z: {
        type: "float",
        description: "z in(-300) to out(300) of hand0 position"
      },
      hand1x: {
        type: "float",
        description: "x left (-300) to right (300) of hand1 position"
      },
      hand1y: {
        type: "float",
        description: "y down(80) to up(900) of hand1 position"
      },
      hand1z: {
        type: "float",
        description: "z in(-300) to out(300) of hand1 position"
      },
      pointer0xz: {
        type: "float",
        description: "rotation on plane"
      },
      pointer1xz: {
        type: "float",
        description: "rotation on plane"
      }
    }

  });


});
