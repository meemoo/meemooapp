// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-fit"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "fit",
      description: "scale and crop an image to fit the given size"
    },
    initializeModule: function(){
      this._crop = {left:0, top:0, width:320, height:240};
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
      var ratio = w/h;

      var inWidth = this._image.width;
      var inHeight = this._image.height;
      this.$(".info").text("input: "+inWidth+"x"+inHeight+", output: "+w+"x"+h);

      var inRatio = inWidth/inHeight;

      if (ratio >= inRatio) {
        this._crop.width = inWidth;
        this._crop.height = Math.floor(inWidth/ratio);
        this._crop.left = 0;
        this._crop.top = Math.floor((inHeight-this._crop.height)/2);
      } else {
        this._crop.width = Math.floor(inHeight*ratio);
        this._crop.height = inHeight;
        this._crop.left = Math.floor((inWidth-this._crop.width)/2);
        this._crop.top = 0;
      }

    },
    _image: null,
    _imageWidth: 0,
    _imageHeight: 0,
    inputimage: function(image){
      if (this._imageWidth !== image.width || this._imageHeight !== image.height) {
        // New image, different size
        this._imageWidth = image.width;
        this._imageHeight = image.height;
        this.resetSizes = true;
      }
      this._image = image;
      this._triggerRedraw = true;
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    resetSizes: false,
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
        this.context.drawImage(this._image, this._crop.left, this._crop.top, this._crop.width, this._crop.height, 0, 0, this._width, this._height);
        this.inputsend();
      }
    },
    inputs: {
      image: {
        type: "image",
        description: "image to crop and size"
      },
      width: {
        type: "int",
        min: 1,
        max: 2000,
        "default": 320
      },
      height: {
        type: "int",
        min: 1,
        max: 2000,
        "default": 240
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
