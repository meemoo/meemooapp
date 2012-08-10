/*global Stats:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["util-stats"] = Iframework.NativeNodes["util"].extend({

    info: {
      title: "stats",
      description: "fps and memory stats from mr.doob"
    },
    initializeModule: function(){
      var self = this;
      if (window.Stats) {
        if (!this._stats) {
          // Only set it up once
          this._stats = new Stats();
          this.$el.append(this._stats.domElement);
          this._interval = window.setInterval(function(){
            self._stats.update();
          }, 1000/60);
        }
      } else {
        yepnope({
          load: "libs/Stats.js",
          complete: function () {
            self.initializeModule();
          }
        });
      }
    }

  });


});
