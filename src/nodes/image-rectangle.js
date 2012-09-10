// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-rectangle"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "rectangle",
      description: "draw a rectangle"
    },
    initializeModule: function(){
      
    },
    inputfill: function (color) {
      this._triggerRedraw = true;
      this._fill = color;
      this.context.fillStyle = this._fill;
    },
    inputstroke: function (color) {
      this._triggerRedraw = true;
      this._stroke = color;
      this.context.strokeStyle = this._stroke;
    },
    inputstrokewidth: function (w) {
      this._triggerRedraw = true;
      this._strokewidth = w;
      this.context.lineWidth = this._strokewidth;
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "background") {
        this._background = null;
        this._triggerRedraw = true;
      }
    },
    canvasSettings: function () {
      this.context.fillStyle = this._fill;
      this.context.strokeStyle = this._stroke;
      this.context.lineWidth = this._strokewidth;
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var setSettings = false;
      if (this._background) {
        if (this.canvas.width !== this._background.width || this.canvas.height !== this._background.height) {
          this.canvas.width = this._background.width;
          this.canvas.height = this._background.height;
          setSettings = true;
        }
      } else {
        var width = this._w + 2*this._x;
        if (this.canvas.width !== width) {
          this.canvas.width = this._w + 2*this._x;
          setSettings = true;
        }
        var height = this._h + 2*this._y;
        if (this.canvas.height !== height) {
          this.canvas.height = this._h + 2*this._y;
          setSettings = true;
        }
      }
      if (setSettings) {
        this.canvasSettings();
      }
      // BG
      if (this._background) {
        this.context.drawImage(this._background, 0, 0);
      }
      // Fill
      if (this._fill && this._fill!=="") {
        this.context.fillRect(this._x, this._y, this._w, this._h);  
      }
      // Stroke
      if (this._stroke && this._stroke!=="" && this._strokewidth && this._strokewidth>0) {
        this.context.strokeRect(this._x, this._y, this._w, this._h);  
      }
      this.inputsend();
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    inputs: {
      background: {
        type: "image",
        description: "first image layer"
      },
      x: {
        type: "float",
        description: "x of top-left corner",
        "default": 75
      },
      y: {
        type: "float",
        description: "y of top-left corner",
        "default": 75
      },
      w: {
        type: "float",
        description: "rectangle width",
        "default": 350
      },
      h: {
        type: "float",
        description: "rectangle height",
        "default": 350
      },
      fill: {
        type: "color",
        description: "fill color",
        "default": ""
      },
      stroke: {
        type: "color",
        description: "stroke color",
        "default": "black"
      },
      strokewidth: {
        type: "float",
        description: "stroke width",
        "default": 1
      },
      // clear: {
      //   type: "bang",
      //   description: "clear the canvas"
      // },
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
