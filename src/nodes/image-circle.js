// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-circle"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "circle",
      description: "draw a circle"
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

      var width = 2*this._x;
      if (this.canvas.width !== width) {
        this.canvas.width = 2*this._x;
        setSettings = true;
      }
      var height = 2*this._y;
      if (this.canvas.height !== height) {
        this.canvas.height = 2*this._y;
        setSettings = true;
      }

      if (setSettings) {
        this.canvasSettings();
      }
      // Fill
      this.context.beginPath();
      this.context.arc(this._x, this._y, this._r, 0, Math.PI*2);
      if (this._fill && this._fill!=="") {
        this.context.fill();
      }
      // Stroke
      if (this._stroke && this._stroke!=="" && this._strokewidth && this._strokewidth>0) {
        this.context.stroke();
      }
      this.inputsend();
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    inputs: {
      x: {
        type: "float",
        description: "x of center",
        "default": 50
      },
      y: {
        type: "float",
        description: "y of center",
        "default": 50
      },
      r: {
        type: "float",
        description: "circle radius",
        "default": 50
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
