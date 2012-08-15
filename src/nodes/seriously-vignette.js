/*global Seriously:true*/

// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["seriously-vignette"] = Iframework.NativeNodes["seriously"].extend({

    info: {
      title: "vignette",
      description: "Seriously.js (WebGL) image vignette"
    },
    _ready: false,
    initializeModule: function(){
      if (this._seriously) {
        this._ready = true;
        if (this._deferStart && this._image) {
          this.inputimage(this._image);
        }
      } else {
        // Iframework.NativeNodes["seriously"] will call initializeModule() again.
      }
    },
    _deferStart: false,
    inputimage: function (image) {
      if (image !== this._image) {
        // Need to reset Seriously
        this._image = image;
      }
      if (this.canvas.width !== this._image.width || this.canvas.height !== this._image.height) {
        this.canvas.width = this._image.width;
        this.canvas.height = this._image.height;
      }
      if (this._ready) {
        if (this._vignette) {
          // Render frame
          this._triggerRedraw = true;
        } else {
          this._source = this._seriously.source(this._image);
          this._target = this._seriously.target(this.canvas);
          this._vignette = this._seriously.effect('vignette');

          this._vignette.source = this._source;
          this._target.source = this._vignette;
          // No Seriously.go() because Meemoo has own loop

          if (this._amount) {
            this._vignette.amount = this._amount;
          }

          this._triggerRedraw = true;
        }
      } else {
        this._deferStart = true;
      }
    },
    inputamount: function (f) {
      this._amount = f;
      if (this._vignette) {
        this._vignette.amount = this._amount;
      }
      // Render frame
      this._triggerRedraw = true;
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    redraw: function(timestamp){
      if (this._source) {
        this._source.update();
        this._target.render();
        this.send("image", this.canvas);
      }
    },
    inputs: {
      image: {
        type: "image",
        description: "input image",
        maxEdges: 1
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
