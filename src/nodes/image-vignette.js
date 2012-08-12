/*global Seriously:true*/

// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-vignette"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "vignette",
      description: "Seriously.js (WebGL) image vignette"
    },
    _ready: false,
    initializeModule: function(){
      if (window.Seriously) {
        if (!Iframework._seriously) {
          // Only one Seriously object
          Iframework._seriously = new Seriously();
        }
        this._seriously = Iframework._seriously;
        this._ready = true;
      } else {
        var self = this;
        yepnope({
          // load: "libs/seriously.min.js",
          load: ["libs/Seriously.js/seriously.js","libs/Seriously.js/effects/seriously.vignette.js"],
          complete: function () {
            self.initializeModule();
          }
        });
      }
    },
    inputimage: function (image) {
      if (image !== this._image) {
        this._image = image;
      }
      if (this._ready) {
        if (this._vignette) {
          // Render frame
          // this._vignette.render();
          // this._seriously.render();
        } else {
          this._source = this._seriously.source(this._image);
          this._target = this._seriously.target(this.canvas);
          this._vignette = this._seriously.effect('vignette');

          this._vignette.source = this._source;
          this._target.source = this._vignette;
          this._seriously.go();

          if (this._amount) {
            this._vignette.amount = this._amount;
          }
        }
      } 
    },
    inputamount: function (f) {
      this._amount = f;
      if (this._vignette) {
        this._vignette.amount = this._amount;
      }
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    redraw: function(){
    },
    inputs: {
      image: {
        type: "image",
        description: "input image"
      },
      amount: {
        type: "float",
        description: "vignette amount",
        "min": 0,
        "default": 1
      },
      send: {
        type: "bang",
        description: "send the combined canvas"
      }
    },
    outputs: {
      image: {
        type: "image"
      }
    }

  });


});
