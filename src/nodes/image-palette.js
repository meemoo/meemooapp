// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  function componentToHex(c) {
    var hex = parseInt( c, 10 ).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  var rgbToHex = function ( rgb ) {
    var rgbRegex = /^rgb\((\d+),(\d+),(\d+)\)$/ ;
    var result, r, g, b, hex = "";
    if ( (result = rgbRegex.exec(rgb)) ) {
      hex = "#" + componentToHex(result[1]) + componentToHex(result[2]) + componentToHex(result[3]);
      return hex;
    }
    return false;
  };

  var template = 
    '<div class="palette" style="padding: 1px 0 0 1px;"></div>'+
    '<div class="info">input an image to make a palette</div>'+
    '<button class="export-rgb">export rgb</button>'+
    '<button class="export-hex">export hex</button>';

  Iframework.NativeNodes["image-palette"] = Iframework.NativeNodes["image"].extend({

    template: _.template(template),
    info: {
      title: "palette",
      author: "nrabinowitz",
      description: "get color palette from image color quantize"
    },
    events: {
      "click .export-rgb" : "exportRGB",
      "click .export-hex" : "exportHex"
    },
    _workerBusy: false,
    initializeModule: function(){
      // Clear canvas (we're extending image to get the droppable)
      $(this.canvas).remove();
      delete this.context;
      delete this.canvas;

      // Setup worker
      var self = this;
      this._worker = new Worker('src/nodes/image-palette-worker.js');
      this._worker.addEventListener('message', function (e) {
        // HACK
        self.set("palette", e.data);

        self._palette = e.data;
        self.renderPalette(self._palette);
        self.inputsend();
        self._workerBusy = false;
      }, false);
      this._worker.addEventListener('error', function (e) {
        console.warn(e);
      }, false);
    },
    inputimage: function(image) {
      this._image = image;
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
        this.$(".info").text("Can't getImageData from that image :(");
        // console.log(e);
      }
    },
    inputpalette: function (palette) {
      this._palette = palette;
      this.renderPalette(palette);
    },
    _max: 16,
    inputmax: function (max) {
      max = parseInt(max, 10);
      if (max===max){
        this._max = max;
        if (this._image) {
          this.inputimage(this._image);
        }
      }
    },
    renderPalette: function(palette){
      this.$(".info, .palette").empty();

      var self = this;
      var clickColor = function(){
        var color = $(this).css("background-color");
        self.send("color", color);
        self.$(".info").text(color);
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
    exportRGB: function () {
      var code = JSON.stringify(this._palette, null, "  ");
      // window.alert(code);
      window.open( "data:text/javascript," + window.escape(code) );
    },
    exportHex: function () {
      var hexen = [];
      for (var i=0; i<this._palette.length; i++) {
        var hex;
        if ( (hex=rgbToHex(this._palette[i])) ) {
          hexen.push( hex );
        }
      }
      var code = JSON.stringify(hexen, null, "  ");
      // window.alert(code);
      window.open( "data:text/javascript," + window.escape(code) );
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
