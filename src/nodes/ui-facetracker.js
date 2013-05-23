/*global headtrackr:true*/

$(function(){

  Iframework.NativeNodes["ui-facetracker"] = Iframework.NativeNodes["ui"].extend({

    info: {
      title: "facetracker",
      description: "checks image for face, sends coordinates"
    },
    _loaded: false,
    initializeModule: function(){
      // Load library
      var self = this;
      if (window.headtrackr) {
        // Make canvas
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        // this.$el.prepend(this.canvas);

        // Start htracker
        this._htracker = new headtrackr.Tracker({
          ui: false, 
          calcAngles: false
        });
        this._htracker.customStart(this.canvas, this.context);

        // Add listener
        document.addEventListener('headtrackrStatus', 
          function (event) {
            self._busy = false;
            self.$(".info").text(event.status);
          }
        );
        document.addEventListener('facetrackingEvent', 
          function (event) {
            self._busy = false;
            self.sendfaceRect(event);
          }
        );

        this._loaded = true;
      } else {
        yepnope({
          load: "libs/headtrackr.js",
          complete: function () {
            self.initializeModule();
          }
        });
      }
    },
    _busy: false,
    _busyReset: null,
    inputimage: function (image) {
      if (!this._loaded) { return; }
      if (this._busy) { 
        if (!this._busyReset){
          var self = this;
          this._busyReset = window.setTimeout(function(){
            self._busy = false;
            self._busyReset = null;
          }, 500);
        }
        return; 
      }
      if (this.canvas.width !== image.width) {
        this.canvas.width = image.width;
      }
      if (this.canvas.height !== image.height) {
        this.canvas.height = image.height;
      }
      if (this._htracker) {
        this._busy = true;
        this._htracker.customTrack(image);
      }
    },
    sendfaceRect: function (event) {
      var a = [
        event.x - Math.round(event.width/2),
        event.y - Math.round(event.height/2),
        event.width,
        event.height
      ];
      this.send("faceRect", a);
      this.send("x", event.x);
      this.send("y", event.y);
      this.send("width", event.width);
      this.send("height", event.height);
    },
    inputs: {
      image: {
        type: "image",
        description: "image to analyse"
      }
    },
    outputs: {
      faceRect: {
        type: "array:f4",
        description: "a rectangle array with x, y, width, height"
      },
      x: {
        type: "float",
        description: "x of center of face"
      },
      y: {
        type: "float",
        description: "y of center of face"
      },
      width: {
        type: "float",
        description: "width of face"
      },
      height: {
        type: "float",
        description: "height of face"
      }
      // angle: {
      //   type: "float",
      //   description: "angle of face"
      // }
    }

  });


});
