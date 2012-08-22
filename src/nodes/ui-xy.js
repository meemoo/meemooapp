/*global Stats:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="xypad" style="position:absolute; overflow:hidden; top:0;right:0;bottom:0;left:0;">'+
      '<span class="info" style="font-size:10px;">(0.5,0.5)</span>'+
      '<div class="xy" style="position:absolute; font-size:20px; top:50%;left:50%; cursor:default; height:20px;width:20px;">+</div>'+
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
          },
          containment: "parent"
        });
    },
    resize: function(){
      this.$(".xy")
        .css({
          left: this._xPercent * 0.9 * 100 + "%",
          top: this._yPercent * 0.9 * 100 + "%"
        });
    },
    sendPosition: function(pos){
      this._xPercent = (pos.left - 10) / (this._width - 30);
      this._xPercent = Math.max(0, this._xPercent);
      this._xPercent = Math.min(1.0, this._xPercent);
      var xPercentRound = Math.round(this._xPercent*1000)/1000;
      this._yPercent = (pos.top - 10) / (this._height - 30);
      this._yPercent = Math.max(0, this._yPercent);
      this._yPercent = Math.min(1.0, this._yPercent);
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
