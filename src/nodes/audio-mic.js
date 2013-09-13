/*global TWEEN:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  // Average and normalize FFT to 3 values
  var lowMidHigh = function(fft) {
    var low = 0; var mid = 0; var high = 0;
    var max = 255;
    for (var i=0; i<3; i++) {
      low += fft[i];
    }
    for (i=3; i<6; i++) {
      mid += fft[i];
    }
    for (i=6; i<9; i++) {
      high += fft[i];
    }
    low = low/3/max;
    mid = mid/3/max;
    high = high/3/max;
    return [low, mid, high];
  };

  // var template = '<div class="info"></div>';

  Iframework.NativeNodes["audio-mic"] = Iframework.NativeNodes["audio"].extend({

    // template: _.template(template),
    info: {
      title: "mic",
      description: "webrtc mic to web audio api"
    },
    initializeModule: function(){
      this.audioOutput = this.audioContext.createGain();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 32;
      this.audioOutput.connect(this.analyser);
      this.fftData = new Uint8Array(this.analyser.frequencyBinCount);
    },
    started: false,
    inputstart: function(){
      var self = this;
      if ( !navigator.getUserMedia ) {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || null;
      }
      if (!navigator.getUserMedia) { return; }
      navigator.getUserMedia(
        {audio: true}, 
        function(stream) {
          self._stream = stream;
          var microphone = self.audioContext.createMediaStreamSource(stream);
          microphone.connect(self.audioOutput);
          self.started = true;
        }, 
        function(error){}
      );
    },
    renderAnimationFrame: function (timestamp) {
      if (this.started) {
        this.analyser.getByteFrequencyData(this.fftData);
        var simplified = lowMidHigh(this.fftData);
        this.send("low", simplified[0]);
        this.send("mid", simplified[1]);
        this.send("high", simplified[2]);
      }
    },
    inputstop: function(){
      this._stream.stop();
      self.started = false;
    },
    inputs: {
      start: {
        type: "bang",
        description: "start mic"
      },
      stop: {
        type: "bang",
        description: "stop mic"
      }
    },
    outputs: {
      audio: {
        type: "audio"
      },
      low:{
        type: "number"
      },
      mid:{
        type: "number"
      },
      high:{
        type: "number"
      }
    }

  });


});
