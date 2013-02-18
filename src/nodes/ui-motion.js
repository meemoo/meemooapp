/*global Stats:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="info"></div>'+
    '<div class="pos" style="font-size: 80px; border:1px black dotted; position: absolute; top: 50px; left: 50px; width: 100px; height: 100px; text-align: center;">↑</div>'+
    '<label><input type="checkbox" class="active" checked /> active</label>';

  Iframework.NativeNodes["ui-motion"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "motion",
      description: "sends device motion (accelerometer) data as percentage (Chrome and iOS only)"
    },
    events: {
      "change .active": "changeActive"
    },
    transform: function(el, val) {
      el.style.webkitTransform = val;
      el.style.mozTransform = val;
      el.style.msTransform = val;
      el.style.oTransform = val;
      el.style.transform = val;
    },
    initializeModule: function(){
      // Element references
      this.pos = this.$(".pos")[0];

      // Listener
      if (window.DeviceOrientationEvent) {
        var self = this;
        window.addEventListener("deviceorientation", function (event) {
          if (self._active) {
            self.sendPosition(event.gamma, event.beta);
          }
        }, true);
      } else {
        this.$(".info").text("deviceorientation not supported");
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
    sendPosition: function(gamma, beta){
      // gamma is the left-to-right tilt in degrees, where right is positive
      var tiltLR = gamma / 90 / 2 + 0.5;
      // beta is the front-to-back tilt in degrees, where front is positive
      var tiltFB = beta / 90 / 2 + 0.5;
      // alpha is the compass direction the device is facing in degrees
      // var dir = event.alpha;

      // Send values
      this.send("tiltLR", tiltLR);
      this.send("tiltFB", tiltFB);

      // Visual indicators
      this.transform(this.pos, "rotateZ("+gamma+"deg) rotateX("+beta+"deg)");
      // this.lr.style.webkitTransform = "rotate("+gamma+"deg)";
      // this.fb.style.webkitTransform = "rotate("+beta+"deg)";
    },
    outputs: {
      tiltLR: {
        type: "float",
        description: "left-right tilt, normalized to 0.0 - 1.0"
      },
      tiltFB: {
        type: "float",
        description: "front-back tilt, normalized to 0.0 - 1.0"
      }
    }

  });


});
