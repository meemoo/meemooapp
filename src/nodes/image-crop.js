// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-crop"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "crop",
      description: "crop an image to x, y, width, height"
    },
    initializeModule: function(){
    },
    setSizes: function(){
      var w = this._width;
      var h = this._height;
      if (this.canvas.width !== w) {
        this.canvas.width = w;
      }
      if (this.canvas.height !== h) {
        this.canvas.height = h;
      }
    },
    _image: null,
    inputimage: function(image){
      this._image = image;
      this._triggerRedraw = true;
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    resetSizes: false,
    inputrect: function (rect) {
      this._x = rect[0];
      this._y = rect[1];
      this._width = rect[2];
      this._height = rect[3];
      this.resetSizes = true;
    },
    inputwidth: function(w){
      this._width = w;
      this.resetSizes = true;
      this._triggerRedraw = true;
    },
    inputheight: function(h){
      this._height = h;
      this.resetSizes = true;
      this._triggerRedraw = true;
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "image") {
        this._image = null;
        // this._triggerRedraw = true;
      }
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (this._image) {
        if (this.resetSizes) {
          this.setSizes();
          this.resetSizes = false;
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this._image, this._x, this._y, this._width, this._height, 0, 0, this._width, this._height);
        this.inputsend();
      }
    },
    inputs: {
      image: {
        type: "image",
        description: "image to crop and size"
      },
      rect: {
        type: "array:f4",
        description: "a rectangle array with x, y, width, height"
      },
      x: {
        type: "int",
        min: 0,
        "default": 0
      },
      y: {
        type: "int",
        min: 0,
        "default": 0
      },
      width: {
        type: "int",
        min: 1,
        max: 2000,
        "default": 100
      },
      height: {
        type: "int",
        min: 1,
        max: 2000,
        "default": 100
      },
      send: {
        type: "bang",
        description: "send the image"
      }
    },
    outputs: {
      image: {
        type: "image",
        description: "sized and cropped image"
      }
    }

  });


});
