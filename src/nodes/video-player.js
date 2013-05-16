// extends src/nodes/video.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<video id="video-<%= id %>" class="video" controls="true" autoplay="true" crossorigin="anonymous" style="max-width:100%;" /><br />'+
    '<button class="play">play</button>'+
    '<button class="pause">pause</button>'+
    '<button class="send">send</button>'+
    '<button class="back">back</button>'+
    '<button class="forward">forward</button><br />'+
    '<span style="position:absolute;width:0px;overflow:hidden;"><input type="file" class="fileinput" accept="video/*" /></span>'+
    '<button class="choosefile">choose file</button>'+
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
      "click .send": "inputsend",
      "click .back": "inputback",
      "click .forward": "inputforward",
      "click .choosefile": "chooseFile",
      "change .fileinput":  "choseFile"
    },
    initializeModule: function(){
      this.$("button").button();

      this._video = this.$("video")[0];
      this._video.crossOrigin = "anonymous";
      this._video.crossorigin = "anonymous"; // moz bug?
      var self = this;
      $(this._video).on("loadedmetadata", function(e){
        self.loadedMetadata();
      });
    },
    inputurl: function(url){
      if (this._url !== url) {
        // TODO: remake video element, since ff doesn't notice source changes
        // this.$el.remove(this._video);
        // this._video = $('<video id="video-<%= id %>" class="video" controls="true" autoplay="true" style="max-width:100%;" />');
        this._url = url;
        this._corsTested = false;
        this._corsOK = false;
        this._videoStarted = false;
        var urls = url.split(" ");
        if (urls.length === 1) {
          this._video.src = url;
        } else {
          // Multiple sources
          this._video.removeAttribute("src");
          var sources = "";
          _.each(urls, function(url){
            sources += '<source src="'+url+'" />';
          });
          $(this._video).html(sources);
        }
      }
    },
    chooseFile: function(){
      this.$(".fileinput").trigger("click");
    },
    choseFile: function (event){
      // Thanks Robert Nyman https://hacks.mozilla.org/2012/04/taking-pictures-with-the-camera-api-part-of-webapi/
      // Get a reference to the taken picture or chosen file
      var files = event.target.files;
      if (files.length > 0) {
        this.loadFile(files[0]);
      }
    },
    loadFile: function(file) {
      try {
        // Create ObjectURL
        var imgURL = window.URL.createObjectURL(file);
        // Set img src to ObjectURL
        this._video.src = imgURL;
        // Revoke ObjectURL
        // window.URL.revokeObjectURL(imgURL);
      }
      catch (e) {
        try {
          // Fallback if createObjectURL is not supported
          var fileReader = new FileReader();
          fileReader.onload = function (event) {
            this._video.src = event.target.result;
          };
          fileReader.readAsDataURL(file);
        }
        catch (error) {
          console.warn("Neither createObjectURL nor FileReader are supported");
        }
      }
    },    loadedMetadata: function(){
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

      // Initialize hidden canvas, size match video
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext('2d');
      this.canvas.width = this._width;
      this.canvas.height = this._height;

      this._videoStarted = true;
    },
    _corsTested: false,
    _corsOK: false,
    drawFrame: function(){
      if (!this._videoStarted) { return false; }

      if (!this._corsTested) {
        this._corsOK = false;
        // Test for cross-origin blarp
        var testCanvas = document.createElement("canvas");
        var testContext = testCanvas.getContext("2d");
        testContext.drawImage(this._video, 0, 0);
        try {
          testContext.getImageData(0, 0, 1, 1);
          this._corsOK = true;
          this.$(".info").html('');
        } catch (e) {
          this._corsOK = false;
          this.$(".info").html('( ;_;) We can\'t get the image data from this video. Encourage your video host to <a href="http://enable-cors.org/" target="_blank">enable CORS</a>. There might be a workaround by using <a href="http://www.corsproxy.com/" target="_blank">this proxy</a> in the video URL.');
        }
        this._corsTested = true;
      }

      if (this._corsOK) {
        this.context.drawImage(this._video, 0, 0);
        this.send("stream", this.canvas);
        if (this._sendNext) {
          this.send("image", this.canvas);
          this._sendNext = false;
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
    inputvolume: function (v){
      this._video.volume = v;        
    },
    _frameTime: 1/30,
    inputforward: function (){
      this._video.pause();
      this._video.currentTime += this._frameTime;
    },
    inputback: function (){
      this._video.pause();
      this._video.currentTime -= this._frameTime;
    },
    _sendNext: false,
    inputsend: function () {
      if (this._video.paused) {
        // Send now
        this.send("image", this.canvas);
      } else {
        // Send next
        this._sendNext = true;
      }
    },
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
        this._lastRedraw = timestamp;
      }
    },
    inputs: {
      url: {
        type: "string",
        description: "video file, or space-separated list of urls for different formats (http://...webm http://...mp4)"
      },
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
      volume: {
        type: "float",
        description: "volume, 0 to 1",
        min: 0,
        max: 1,
        "default": 1
      },
      forward: {
        type: "bang",
        description: "skip video forward (depends on browser/codec)"
      },
      back: {
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
