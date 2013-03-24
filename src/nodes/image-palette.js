// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-palette"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "palette",
      author: "ticky+flickr+forresto",
      description: "monochrome by atkinson, bayer, floydsteinberg, or no dither"
    },
    _workerBusy: false,
    initializeModule: function(){
      // Clear canvas
      $(this.canvas).remove();
      delete this.context;
      delete this.canvas;

      // Info
      this.$(".info").text("input an image to make a palette");

      // Palette container
      var paletteDiv = $('<div class="palette"></div>').css({
        "background-color": "black",
        "padding": "1px 0 0 1px"
      });
      this.$(".info").before( paletteDiv );

      // Setup worker
      var self = this;
      this._worker = new Worker('src/nodes/image-palette-worker.js');
      this._worker.addEventListener('message', function (e) {
        // HACK
        self.model.setValue({"palette":e.data});

        self._palette = e.data;
        self.renderPalette(self._palette);
        self.inputsend();
        self._workerBusy = false;
      }, false);
      this._worker.addEventListener('error', function (e) {
        console.log(e);
      }, false);
    },
    inputimage: function(image) {
      if (!this._worker || this._workerBusy) { return false; }

      // Reduce size of big images
      if (image.width > 2 && image.height > 2 && image.width * image.height > 500*500) {
        var width = image.width;
        var height = image.height;
        while (width > 2 && height > 2 && width * height > 500*500) {
          width = Math.floor(width/2);
          height = Math.floor(height/2);
        }
        var small = document.createElement("canvas");
        small.width = width;
        small.height = height;
        small.getContext('2d').drawImage( image, 0, 0, image.width, image.height, 0, 0, width, height );
        image = small;
      }

      try {
        var imageData = image.getContext('2d').getImageData( 0, 0, image.width, image.height );
        this._worker.postMessage({
          imageData: imageData,
          maxColors: this._max
        });
        // Don't process a new frame until this one is done
        this._workerBusy = true;
      } catch(e) {
        // Can't getImageData
        // console.log(e);
      }
    },
    inputpalette: function (palette) {
      this._palette = palette;
      this.renderPalette(palette);
    },
    renderPalette: function(palette){
      this.$(".info, .palette").empty();

      var self = this;
      var clickColor = function(){
        self.send("color", $(this).css("background-color"));
      };
      for (var i=0; i<palette.length; i++) {
        var button = $('<button title="'+palette[i]+'"></button>')
          .css({
            "background-color": palette[i],
            "width": "48px", 
            "height": "48px",
            "margin": "0 1px 1px 0",
            "padding": 0,
            "border-width": 0,
            "border-radius": 0
          })
          .click(clickColor);
        this.$(".palette").append(button);
      }
      // this.$(".info").text( palette.toString() );
    },
    inputrandom: function (index) {
      if (this._palette && this._palette.length > 0) {
        var color = this._palette[ Math.floor(this._palette.length * Math.random()) ];
        this.send("color", color);
      }
    },
    inputsendOne: function (index) {
      if (this._palette && index < this._palette.length) {
        this.send("color", this._palette[index]);
      }
    },
    inputsend: function () {
      this.send("palette", this._palette);
    },
    inputs: {
      image: {
        type: "image",
        description: "extract palette from this image"
      },
      palette: {
        description: "color palette (array of css colors)",
        type: "array"
      },
      max: {
        description: "max number of colors in the palette",
        type: "int",
        min: 2,
        max: 256,
        "default": 16
      },
      random: {
        type: "bang",
        description: "send one random color from palette"
      },
      sendOne: {
        type: "int",
        description: "send the color with this index",
        min: 0
      },
      send: {
        type: "bang",
        description: "send the color palette"
      }
    },
    outputs: {
      palette: {
        description: "color palette (array of css colors)",
        type: "array"
      },
      color: {
        description: "one color",
        type: "color"
      }
    }

  });


});
