// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-cam"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "cam",
      description: "webcam (HTML5 getUserMedia with Flash backup)"
    },
    initializeModule: function(){
      // Mirror preview
      $(this.canvas).css({
        "-webkit-transform": "scale(-1, 1)",
        "-moz-transform": "scale(-1, 1)",
        "-o-transform": "scale(-1, 1)",
        "transform": "scale(-1, 1)"        
      });
      this._crop = { left:0, top:0, width:640, height:480 };
      var self = this;
      this.$el.prepend('<button class="startcamera">start camera</button>');
      this.$(".startcamera")
        .button()
        .click(function(){
          self.startCam();
        });
      // this.startCam();
    },
    _camStarted: false,
    startCam: function(){
      var self = this;
      this.$(".startcamera").remove();

      if (!this._video) {
        this._video = document.createElement("video");
        this._video.autoplay = true;
        $(this._video).on("loadedmetadata", function(e){
          self.setSizes();
        });
      }

      if ( !window.URL ) {
        window.URL = window.webkitURL || window.msURL || window.oURL;
      }
      if ( !navigator.getUserMedia ) {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || false;
      }
      if (navigator.getUserMedia) {
        navigator.getUserMedia( { video: true, audio: false }, function(stream){
          if (navigator.mozGetUserMedia) {
            // HACK for ff
            self._video.src = stream;
            self._video.play();
          } else {
            if (window.URL.createObjectURL) {
              self._video.src = window.URL.createObjectURL(stream);
            } else {
              self._video.src = stream;
            }
          }
          // Sets up frame draw interval
          self.inputfps(self._fps);
          self._camStarted = true;
          self._triggerRedraw = true;
        }, function(error){
          console.warn("User denied webcam access.");
          self.setupPlaceholderVideo();
        });
      } else {
        console.warn("Browser doesn't support getUserMedia webcam.");
        this.setupPlaceholderVideo();
      }
    },
    setupPlaceholderVideo: function(){
      // Video file instead of webcam
      $(this._video).attr({
        "autoplay": "true",
        "loop": "true",
        "src": "img/no-webcam.webm"
      }).on('ended', function(){
        this.play();
      });
      // Sets up frame draw interval
      this.inputfps(20);
      this._camStarted = true;
      this._triggerRedraw = true;
    },
    setSizes: function(){
      if (this._video) {
        // Here we find the webcam's reported size
        this._video.width = this._video.videoWidth;
        this._video.height = this._video.videoHeight;
        if (!this._video.height) {
          // Firefox takes its time; try again in 0.5s
          var self = this;
          window.setTimeout(function(){
            self.setSizes();
          }, 500);
          return false;
        }
      } else {
        return false;        
      }

      // Called from this._video loadedmetadata
      var w = this._width;
      var h = this._height;
      this.canvas.width = w;
      this.canvas.height = h;
      var ratio = w/h;

      var vidWidth = this._video.width;
      var vidHeight = this._video.height;
      this.$(".info").text("Cam resolution: "+vidWidth+"x"+vidHeight+", output: "+w+"x"+h);

      var camRatio = vidWidth/vidHeight;

      if (ratio >= camRatio) {
        this._crop.width = vidWidth;
        this._crop.height = vidWidth/ratio;
        this._crop.left = 0;
        this._crop.top = Math.floor((vidHeight-this._crop.height)/2);
      } else {
        this._crop.width = vidHeight*ratio;
        this._crop.height = vidHeight;
        this._crop.left = Math.floor((vidWidth-this._crop.width)/2);
        this._crop.top = 0;
      }
    },
    drawFrame: function(){
      if (!this._camStarted || !this._video || !this._video.height) { return false; }
      this.context.drawImage(this._video, this._crop.left, this._crop.top, this._crop.width, this._crop.height, 0, 0, this._width, this._height);
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
    inputfps: function(f){
      if (f > 0 && f <= this.inputs.fps.max) {
        this._fps = f;
        if (this._interval) {
          clearInterval(this._interval);
        }
        var self = this;
        this._interval = window.setInterval( function(){
          self.drawFrame();
        }, 1000/this._fps);
      }
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
      fps: {
        type: "number",
        description: "frames per second to update the canvas",
        min: 0,
        max: 30,
        "default": 20
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
