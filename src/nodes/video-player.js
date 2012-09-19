// extends src/nodes/video.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<video id="video-<%= id %>" class="video" crossorigin="anonymous" style="max-width:100%;" /><br />'+
    '<button class="play">play</button>'+
    '<button class="pause">pause</button>'+
    '<button class="back">back</button>'+
    '<button class="forward">forward</button>'+
    '<div class="info" />';

  Iframework.NativeNodes["video-player"] = Iframework.NativeNodes["video"].extend({

    template: _.template(template),
    info: {
      title: "video",
      description: "HTML5 video player"
    },
    events: {
      "click .play": "inputplay",
      "click .pause": "inputpause",
      "click .back": "inputback",
      "click .forward": "inputforward"
    },
    initializeModule: function(){
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext('2d');
      this.$("button").button();

      this._video = this.$("video")[0];
      this._video.autoplay = true;
      this._video.controls = true;
      var self = this;
      $(this._video).on("loadedmetadata", function(e){
        self.loadedMetadata();
      });
    },
    inputurl: function(url){
      this._url = url;
      // Multiple sources
      this._urls = url.split(" ");
      var sources = "";
      _.each(this._urls, function(url){
        sources += '<source src="'+url+'" />';
      });
      $(this._video).html(sources);
    },
    loadedMetadata: function(){
      // Called from this._video loadedmetadata
      if (this._video) {
        // Here we find the video's reported size
        this._width = this._video.videoWidth;
        this._height = this._video.videoHeight;
        if (!this._height) {
          // Firefox takes its time; try again in 0.5s
          var self = this;
          window.setTimeout(function(){
            self.loadedMetadata();
          }, 500);
          return false;
        }
      } else {
        return false;        
      }

      // Hidden canvas size match video
      this.canvas.width = this._width;
      this.canvas.height = this._height;
      this._videoStarted = true;
    },
    _corsErrorShown: false,
    drawFrame: function(){
      if (!this._videoStarted) { return false; }
      try {
        this.context.drawImage(this._video, 0, 0);
        this.send("stream", this.canvas);
        if (this._sendNext) {
          this.send("image", this.canvas);
          this._sendNext = false;
        }
      } catch (e) {
        if (!this._corsErrorShown) {
          this.$(".info").text("CORS smth smth...");
          // this._corsErrorShown = true;
        }
      }
    },
    inputplay: function (){
      this._video.play();
    },
    inputpause: function (){
      this._video.pause();
    },
    inputtime: function (time){
      this._video.currentTime = time;
    },
    inputforward: function (){
      this._video.currentTime += 1/30;
    },
    inputback: function (){
      this._video.currentTime -= 1/30;
    },
    _sendNext: false,
    inputsend: function () {
      this._sendNext = true;
    },
    // inputfps: function(f){
    //   if (f > 0 && f <= this.inputs.fps.max) {
    //     this._fps = f;
    //     if (this._interval) {
    //       clearInterval(this._interval);
    //     }
    //     var self = this;
    //     this._interval = window.setInterval( function(){
    //       self.drawFrame();
    //     }, 1000/this._fps);
    //   }
    // },
    remove: function(){
      if (this._stream) {
        this._stream.stop();
      }
      if (this._interval) {
        clearInterval(this._interval);
      }
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (this.resetSizes) {
        this.setSizes();
        this.resetSizes = false;
      }
    },
    _lastTimeSent: null,
    renderAnimationFrame: function (timestamp) {
      // Get a tick from GraphView.renderAnimationFrame()
      // this._valueChanged is set by NodeBox.receive()
      if (this._triggerRedraw) {
        this._triggerRedraw = false;
        this.redraw(timestamp);
      }
      var currentTime = this._video.currentTime;
      if (this._videoStarted && currentTime !== this._lastTimeSent) {
        this.drawFrame();
        this.send("time", currentTime);
        this._lastTimeSent = currentTime;
      }
    },
    inputs: {
      url: {
        type: "string",
        description: "video file, or space-separated list of urls for different formats (http://...webm http://...mp4)"
      },
      // fps: {
      //   type: "number",
      //   description: "frames per second to update the canvas",
      //   min: 0,
      //   max: 30,
      //   "default": 20
      // },
      play: {
        type: "bang",
        description: "play the video"
      },
      pause: {
        type: "bang",
        description: "pause the video"
      },
      time: {
        type: "float",
        description: "skip to time"
      },
      frameForward: {
        type: "bang",
        description: "skip video forward (depends on browser/codec)"
      },
      frameBack: {
        type: "bang",
        description: "skip video back (depends on browser/codec)"
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
      },
      time: {
        type: "float",
        description: "currentTime of video"
      }
    }

  });


});
