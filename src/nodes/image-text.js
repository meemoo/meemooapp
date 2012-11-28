// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-text"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "text",
      description: "draw text to a canvas" 
    },
    initializeModule: function(){
      
    },
    inputfont: function (font) {
      this._triggerRedraw = true;
      this._font = font;
      this.context.font = this._font;
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
      this.context.font = this._font;
      this.context.fillStyle = this._fill;
      this.context.strokeStyle = this._stroke;
      this.context.lineWidth = this._strokewidth;
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var setSettings = false;

      // Canvas size
      var width = this.context.measureText(this._text);
      if (typeof width !== "number" && width.width){
        width = width.width;
      }
      width = Math.ceil(width);
      if (this.canvas.width !== width+20) {
        this.canvas.width = width+20;
        setSettings = true;
      }
      if (this.canvas.height !== this._height) {
        this.canvas.height = this._height;
        setSettings = true;
      }
      // Reset canvas font, fill, stroke
      if (setSettings) {
        this.canvasSettings();
      }

      // Fill
      var y = Math.floor(this._height/2);
      if (this._fill && this._fill!=="") {
        this.context.fillText(this._text, 10, y);
      }
      // Stroke
      if (this._stroke && this._stroke!=="" && this._strokewidth && this._strokewidth>0) {
        this.context.strokeText(this._text, 10, y);
      }
      this.inputsend();
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    inputs: {
      text: {
        type: "string",
        description: "text to render to image",
        "default": "text"
      },
      font: {
        type: "string",
        description: "font settings. example: \"18pt Courier New\" or \"bold 36px Tahoma\"",
        "default": "bold 30px Tahoma"
      },
      height: {
        type: "int",
        description: "height of canvas (font height is set in font)",
        "default": 60        
      },
      fill: {
        type: "color",
        description: "fill color",
        "default": "white"
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
        description: "send the canvas"
      }
    },
    outputs: {
      image: {
        type: "image"
      }
    }

  });


});
