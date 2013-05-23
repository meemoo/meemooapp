// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-triangle"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "triangle",
      description: "draw a triangle"
    },
    initializeModule: function(){
      
    },
    inputmatte: function (image) {
      this._matte = image;
      this._triggerRedraw = true;
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
      if (edge.Target.id === "matte") {
        this._matte = null;
        this._triggerRedraw = true;
      }
    },
    canvasSettings: function () {
      if (this._fill === "") {
        this.context.fillStyle = "none";
      } else {
        this.context.fillStyle = this._fill;
      }
      if (this._stroke === "") {
        this.context.strokeStyle = "none";
      } else {
        this.context.strokeStyle = this._stroke;
      }
      this.context.lineWidth = this._strokewidth;
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (!this._point0 || !this._point1 || !this._point2) { return false; }

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      var setSettings = false;
      var minX = Infinity;
      var minY = Infinity;
      var maxX = 0;
      var maxY = 0;
      for(var i=0; i<3; i++) {
        var x = this["_point"+i][0];
        var y = this["_point"+i][1];
        minX = Math.min(minX, x);
        minY = Math.min(minX, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
      minX = Math.max(minX, 0);
      minY = Math.max(minY, 0);
      maxX = Math.ceil(minX+maxX);
      maxY = Math.ceil(minY+maxY);
      if (this.canvas.width !== maxX) {
        this.canvas.width = maxX;
        setSettings = true;
      }
      if (this.canvas.height !== maxY) {
        this.canvas.height = maxY;
        setSettings = true;
      }
      if (setSettings) {
        this.canvasSettings();
      }
      // Fill
      this.context.beginPath();
      this.context.moveTo(this._point0[0], this._point0[1]);
      for(i=1; i<3; i++) {
        this.context.lineTo(this["_point"+i][0], this["_point"+i][1]);
      }
      this.context.closePath();
      // this.context.lineTo(this._point0[0], this._point0[1]);
      if (this._fill && this._fill!=="") {
        this.context.fill();
      }
      // Stroke
      if (this._stroke && this._stroke!=="" && this._strokewidth && this._strokewidth>0) {
        this.context.stroke();
      }
      if (this._matte) {
        this.context.globalCompositeOperation = "source-in";
        this.context.drawImage(this._matte, 0, 0);
        // Iframework.util.fitAndCopy(this._matte, this.canvas);
        this.context.globalCompositeOperation = "source-over";
      }
      this.inputsend();
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    inputs: {
      matte: {
        type: "image",
        description: "image to cut out"
      },
      point0: {
        type: "array:f2",
        description: "x, y for point 0",
        "default": [10, 10]
      },
      point1: {
        type: "array:f2",
        description: "x, y for point 1",
        "default": [290,10]
      },
      point2: {
        type: "array:f2",
        description: "x, y for point 2",
        "default": [150,290]
      },
      fill: {
        type: "color",
        description: "fill color",
        "default": "black"
      },
      stroke: {
        type: "color",
        description: "stroke color",
        "default": ""
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
