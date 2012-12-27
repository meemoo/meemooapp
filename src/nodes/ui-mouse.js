/*global Stats:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="info">(0.5, 0.5)</div><br>'+
    '<label><input type="checkbox" class="active" checked /> active</label>';

  Iframework.NativeNodes["ui-mouse"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "mouse",
      description: "sends mouse coordinates as percentage"
    },
    events: {
      "change .active": "changeActive"
    },
    initializeModule: function(){
      var self = this;
      $(window).mousemove(function(event){
        if (self._active) {
          self.sendPosition(event.clientX, event.clientY);
        }
      });
      $(window).resize(function(event){
        self.windowResize();
      });
      this.windowResize();
    },
    windowResize: function(){
      this._windowWidth = $(window).width();
      this._windowHeight = $(window).height();
    },
    _active: true,
    changeActive: function(event){
      if (event.target.checked) {
        this._active = true;
      } else {
        this._active = false;
      }
    },
    sendPosition: function(x, y){
      this._xPercent = x/this._windowWidth;
      var xPercentRound = Math.round(this._xPercent*1000)/1000;
      this._yPercent = y/this._windowHeight;
      var yPercentRound = Math.round(this._yPercent*1000)/1000;
      // Display
      this.$(".info").text("("+xPercentRound+","+yPercentRound+")");
      // Send
      this.send("x", this._xPercent);
      this.send("y", this._yPercent);
    },
    outputs: {
      x: {
        type: "float"
      },
      y: {
        type: "float"
      }
    }

  });


});
