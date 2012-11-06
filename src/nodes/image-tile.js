// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-tile"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "tile",
      description: "tile to fill canvas, reflect mirror tile for seamless"
    },
    initializeModule: function(){
      // this.showResizer(20,20,0.5);
    },
    _sizeChanged: false,
    inputwidth: function (w) {
      this._width = w;
      this._sizeChanged = true;
      this._triggerRedraw = true;
    },
    inputheight: function (h) {
      this._height = h;
      this._sizeChanged = true;
      this._triggerRedraw = true;
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "image") {
        this._image = null;
        this._triggerRedraw = true;
      }
    },
    _tile: null,
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (this._sizeChanged) {
        if (this.canvas.width !== this._width) {
          this.canvas.width = this._width;
        }
        if (this.canvas.height !== this._height) {
          this.canvas.height = this._height;
        }
        this._sizeChanged = false;
      }
      if (this._image) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var x = this._x;
        var y = this._y;
        var w = this._image.width;
        var h = this._image.height;

        if (!this._tile) {
          this._tile = document.createElement("canvas");
          this._tileContext = this._tile.getContext("2d");
          this._tile.width = w*2+100;
          this._tile.height = h*2+100;
        }

        this._tileContext.clearRect(0, 0, this._tile.width, this._tile.height);
        this._tileContext.setTransform(1, 0, 0, 1, 0, 0);
        this._tileContext.drawImage(this._image, 0, 0);
        if (this._mirror==="x" || this._mirror==="xy"){
          this._tileContext.setTransform(1, 0, 0, 1, 0, 0);
          this._tileContext.translate(2*w, 0);
          this._tileContext.scale(-1, 1);
          this._tileContext.drawImage(this._image, 0, 0);
          w+=w;
        }
        if (this._mirror==="y" || this._mirror==="xy"){
          this._tileContext.setTransform(1, 0, 0, 1, 0, 0);
          this._tileContext.translate(0, 2*h);
          this._tileContext.scale(1, -1);
          this._tileContext.drawImage(this._tile, 0, 0);
          h+=h;
        }

        while (x>0) {
          x-=w;
        }
        while (y>0) {
          y-=h;
        }

        while(y<this._height) {
          while(x<this._width) {
            this.context.drawImage(this._tile, 0, 0, w, h, x, y, w, h);
            x+=w;
          }
          y+=h;
          // Reset x
          x = this._x;
          while (x>0) {
            x-=w;
          }
        }
      }

      this.inputsend();
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    inputs: {
      image: {
        type: "image",
        description: "image to tile"
      },
      width: {
        type: "int",
        description: "canvas width",
        min: 1,
        "default": 500
      },
      height: {
        type: "int",
        description: "canvas height",
        min: 1,
        "default": 500
      },
      x: {
        type: "float",
        description: "start x",
        "default": 0
      },
      y: {
        type: "float",
        description: "start y",
        "default": 0
      },
      mirror: {
        type: "string",
        description: "'none', 'x', 'y', or 'xy' mirror reflection",
        options: ['none', 'x', 'y', 'xy'],
        "default": "xy"
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
