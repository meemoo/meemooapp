// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-cam"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "cam",
      description: "webcam (HTML5 getUserMedia with Flash backup)"
    },
    initializeModule: function(){
      var self = this;
      this.$(".info").append('<button class="startcamera">start camera</button>');
      this.$(".startcamera")
        .button()
        .click(function(){
          self.startCam();
        });
      // this.startCam();
    },
    _camStarted: false,
    startCam: function(){
      this.$(".startcamera").remove();

      if (!this._video) {
        this._video = document.createElement("video");
        // Will change if getUserMedia returns size
        this._video.width = 640;
        this._video.height = 480;
        // Otherwise just one frame
        this._video.autoplay = true;
      }

      this.setSizes();

      if ( !window.URL ) {
        window.URL = window.webkitURL || window.msURL || window.oURL;
      }
      if ( !navigator.getUserMedia ) {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || false;
      }
      if (navigator.getUserMedia) {
        var self = this;
        navigator.getUserMedia( { video: true, audio: false }, function(stream){
          if (window.URL.createObjectURL) {
            self._video.src = window.URL.createObjectURL(stream);
          } else {
            self._video.src = stream;
          }
          self._camStarted = true;
          self._triggerRedraw = true;
          self._interval = window.setInterval( function(){
            self.drawFrame();
          }, 1000/20);
        }, function(error){
          console.error('An error occurred: [CODE ' + error.code + ']');
        });
      }
    },
    videoCrop: { left:0, top:0, width:640, height:480 },
    setSizes: function(){
      var w = this._width;
      var h = this._height;
      this.canvas.width = w;
      this.canvas.height = h;

      var ratio = w/h;

      // Will change if getUserMedia returns size
      if (ratio >= 4/3) {
        this.videoCrop.width = 640;
        this.videoCrop.height = 640/ratio;
      } else {
        this.videoCrop.width = 480*ratio;
        this.videoCrop.height = 480;
      }
      this.videoCrop.left = Math.floor((640-this.videoCrop.width)/2);
      this.videoCrop.top = Math.floor((480-this.videoCrop.height)/2);

    },
    drawFrame: function(){
      // Video seems locked to 4:3, so crop when drawing to canvas
      // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
      this.context.drawImage(this._video, this.videoCrop.left, this.videoCrop.top, this.videoCrop.width, this.videoCrop.height, 0, 0, this._width, this._height);
      this.send("stream", this.canvas);
      if (this.sendNext) {
        this.send("image", this.canvas);
        this.sendNext = false;
      }
    },
    sendNext: false,
    inputsend: function () {
      this.sendNext = true;
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
      if (edge.Target.id === "background") {
        this._background = null;
        this._triggerRedraw = true;
      }
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (this.resetSizes) {
        this.setSizes();
        this.resetSizes = false;
      }
    },
    inputs: {
      width: {
        type: "int",
        description: "video width",
        min: 1,
        max: 1920,
        "default": 320
      },
      height: {
        type: "int",
        description: "video height",
        min: 1,
        max: 1080,
        "default": 240
      },
      send: {
        type: "bang",
        description: "send the image"
      }
    },
    outputs: {
      stream: {
        type: "image",
        description: "sends constant stream of images"
      },
      image: {
        type: "image",
        description: "sends image only when \"send\" is hit"
      }
    }

  });


});
