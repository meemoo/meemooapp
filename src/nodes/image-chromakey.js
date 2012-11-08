// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  function rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h, s, l;

    if (max === min) {
      h = 0;
    } else if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else if (b === max) {
      h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
      h += 360;
    }

    l = (min + max) / 2;

    if (max === min) {
      s = 0;
    } else if (l <= 0.5) {
      s = delta / (max + min);
    } else {
      s = delta / (2 - max - min);
    }

    h /= 360;
    return [h, s, l];
  }

  Iframework.NativeNodes["image-chromakey"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "chromakey",
      description: "alpha key based on hue"
    },
    initializeModule: function(){
      $(this.canvas).addClass("alpha-bg");
    },
    _hue: 0.33,
    _hueRange: 0.1, 
    _hueMin: this._hue - this._hueRange,
    _hueMax: this._hue + this._hueRange,
    inputhue: function (percent) {
      this._hue = percent;
      this._hueMin = this._hue - this._hueRange;
      this._hueMax = this._hue + this._hueRange;
      this._triggerRedraw = true;
    },
    inputhueRange: function (percent) {
      this._hueRange = percent;
      this._hueMin = this._hue - this._hueRange;
      this._hueMax = this._hue + this._hueRange;
      this._triggerRedraw = true;
    },
    _sat: 0.55,
    _satRange: 0.35, 
    _satMin: this._sat - this._satRange,
    _satMax: this._sat + this._satRange,
    inputsat: function (percent) {
      this._sat = percent;
      this._satMin = this._sat - this._satRange;
      this._satMax = this._sat + this._satRange;
      this._triggerRedraw = true;
    },
    inputsatRange: function (percent) {
      this._satRange = percent;
      this._satMin = this._sat - this._satRange;
      this._satMax = this._sat + this._satRange;
      this._triggerRedraw = true;
    },
    _lightness: 0.5,
    _lightnessRange: 0.3, 
    _lightnessMin: this._lightness - this._lightnessRange,
    _lightnessMax: this._lightness + this._lightnessRange,
    inputlightness: function (percent) {
      this._lightness = percent;
      this._lightnessMin = this._lightness - this._lightnessRange;
      this._lightnessMax = this._lightness + this._lightnessRange;
      this._triggerRedraw = true;
    },
    inputlightnessRange: function (percent) {
      this._lightnessRange = percent;
      this._lightnessMin = this._lightness - this._lightnessRange;
      this._lightnessMax = this._lightness + this._lightnessRange;
      this._triggerRedraw = true;
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "image") {
        this._image = null;
        this._triggerRedraw = true;
      }
    },
    redraw: function(){
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this._image) {
        if (this.canvas.height !== this._image.height) {
          this.canvas.height = this._image.height;
        }
        if (this.canvas.width !== this._image.width) {
          this.canvas.width = this._image.width;
        }

        // With help from http://timtaubert.de/blog/2012/10/building-a-live-green-screen-with-getusermedia-and-mediastreams/
        this.context.drawImage(this._image, 0, 0, this._image.width, this._image.height);
        var frame = this.context.getImageData(0, 0, this._image.width, this._image.height);
        var len = frame.data.length / 4;

        // Iterate over all pixels in the current frame.
        for (var i = 0; i < len; i++) {
          var r = frame.data[i * 4 + 0];
          var g = frame.data[i * 4 + 1];
          var b = frame.data[i * 4 + 2];

          // Convert from RGB to HSL...
          var hsl = rgb2hsl(r, g, b);
          var h = hsl[0];
          var s = hsl[1];
          var l = hsl[2];

          // ... and check if we have a somewhat green pixel.
          if (h >= this._hueMin && h <= this._hueMax &&
              s >= this._satMin && s <= this._satMax &&
              l >= this._lightnessMin && l <= this._lightnessMax) {
            frame.data[i * 4 + 3] = 0;
          }
        }

        this.context.putImageData(frame, 0, 0);

        this.inputsend();
      }
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    inputs: {
      image: {
        type: "image",
        description: "image to key"
      },
      hue: {
        type: "float",
        description: "hue, 0 = red, .33 = green, .67 = blue",
        min: 0,
        max: 1,
        "default": 0.33
      },
      hueRange: {
        type: "float",
        description: "hue range plus or minus",
        min: 0,
        max: 1,
        "default": 0.2
      },
      sat: {
        type: "float",
        description: "saturation",
        min: 0,
        max: 1,
        "default": 0.55
      },
      satRange: {
        type: "float",
        description: "saturation range plus or minus",
        min: 0,
        max: 1,
        "default": 0.4
      },
      lightness: {
        type: "float",
        description: "lightness",
        min: 0,
        max: 1,
        "default": 0.5
      },
      lightnessRange: {
        type: "float",
        description: "lightness range plus or minus",
        min: 0,
        max: 1,
        "default": 0.4
      },
      send: {
        type: "bang",
        description: "send the image"
      }
    },
    outputs: {
      image: {
        type: "image"
      }
    }

  });


});
