/*global Stats:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="xypad" style="position:absolute; overflow:hidden; top:0;right:0;bottom:0;left:0; background:red;">'+
      '<span class="info" style="font-size:10px; color:white;">(0.5,0.5)</span>'+
      '<div class="xy" style="position:absolute; font-size:20px; top:50%;left:50%; color:white;">+</div>'+
    '</div>';

  Iframework.NativeNodes["ui-xy"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "xy pad",
      description: "sends coordinates as percentage"
    },
    initializeModule: function(){
      var self = this;
      // this.$(".xypad")
      //   .mousedown(function(e){
      //     console.log(e);
      //     var offset = $(e.target).offset();
      //     var x = e.pageX - offset.left;
      //     var y = e.pageY - offset.top;
      //     console.log(x,y);
      //     self.$(".xy").css({
      //       left: x+"px",
      //       top: y+"px"
      //     });
      //   });
      this.$(".xy")
        .draggable({
          scroll: false,
          start: function(){
            self._width = self.$(".xypad").width();
            self._height = self.$(".xypad").height();
          },
          drag: function(e, ui){
            self.sendPosition(ui.position);
          }
        });
    },
    sendPosition: function(pos){
      var xPercent = (pos.left - 10) / (this._width - 30);
      xPercent = Math.max(0, xPercent);
      xPercent = Math.min(1.0, xPercent);
      var xPercentRound = Math.round(xPercent*1000)/1000;
      var yPercent = (pos.top - 10) / (this._height - 30);
      yPercent = Math.max(0, yPercent);
      yPercent = Math.min(1.0, yPercent);
      var yPercentRound = Math.round(yPercent*1000)/1000;
      // Display
      this.$(".info").text("("+xPercentRound+","+yPercentRound+")");
      // Send
      this.send("x", xPercent);
      this.send("y", yPercent);
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
