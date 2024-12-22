// extends src/nodes/audio.js which extends src/node-box-native-view.js

$(function () {
  // Average and normalize FFT to 3 values
  var lowMidHigh = function (fft) {
    var low = 0;
    var mid = 0;
    var high = 0;
    var max = 255;
    for (var i = 0; i < 3; i++) {
      low += fft[i];
    }
    for (i = 3; i < 6; i++) {
      mid += fft[i];
    }
    for (i = 6; i < 9; i++) {
      high += fft[i];
    }
    low = low / 3 / max;
    mid = mid / 3 / max;
    high = high / 3 / max;
    return [low, mid, high];
  };

  var template =
    '<div class="info">' +
    '<button class="start">start mic</button>' +
    '<select class="choose"></select>' +
    '<button class="stop">stop</button>' +
    '</div>';

  Iframework.NativeNodes['audio-mic'] = Iframework.NativeNodes['audio'].extend({
    info: {
      title: 'mic',
      description: 'webrtc mic to web audio api',
    },
    template: _.template(template),
    events: {
      'click .start': 'inputstart',
      'change .choose': 'chooseMic',
      'click .stop': 'inputstop',
    },
    initializeModule: function () {
      this.$('.stop').hide();
      this.$('.choose').hide();

      this.audioOutput = this.audioContext.createGain();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 32;
      this.audioOutput.connect(this.analyser);
      this.fftData = new Uint8Array(this.analyser.frequencyBinCount);

      // Create canvas for visualization
      this.canvas = $('<canvas>')
        .attr({width: 150, height: 50})
        .css({
          border: '1px solid #ccc',
          margin: '5px',
        })
        .appendTo(this.$el)[0];
      this.ctx = this.canvas.getContext('2d');
    },
    started: false,
    inputstart: function () {
      var self = this;
      if (!navigator.getUserMedia) {
        navigator.getUserMedia =
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia ||
          null;
      }
      if (!navigator.getUserMedia) {
        return;
      }
      const constraints = {
        video: false,
        audio: this._micId ? {deviceId: this._micId} : true,
      };
      navigator.getUserMedia(
        constraints,
        function (stream) {
          self._stream = stream;
          var microphone = self.audioContext.createMediaStreamSource(stream);
          microphone.connect(self.audioOutput);
          self.started = true;

          self.enumerateDevices();
          self.$('.stop').show();
          self.$('.choose').show();
        },
        function (error) {}
      );
    },
    enumerateDevices: function () {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            const selectEl = this.$('.choose');
            selectEl.empty();
            for (let device of devices) {
              const {kind, label, deviceId} = device;
              if (kind === 'audioinput') {
                selectEl.append(
                  $('<option>', {
                    value: deviceId,
                    text: label,
                    selected: deviceId === this._micId,
                  })
                );
              }
            }
            this.$('.choose').show();
          })
          .catch(() => {});
      }
    },
    _micId: undefined,
    chooseMic: function () {
      this._micId = this.$('.choose').val();
      this.inputstart();
    },
    renderAnimationFrame: function (timestamp) {
      if (this.started) {
        this.analyser.getByteFrequencyData(this.fftData);
        var simplified = lowMidHigh(this.fftData);
        this.send('low', simplified[0]);
        this.send('mid', simplified[1]);
        this.send('high', simplified[2]);
        this.drawViz();
      }
    },
    drawViz: function () {
      var ctx = this.ctx;
      var fft = this.fftData;
      var w = this.canvas.width;
      var h = this.canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#000';
      const barWidth = Math.floor(w / fft.length);
      for (var i = 0; i < fft.length; i++) {
        var x = i * barWidth;
        var y = h - (fft[i] / 255) * h;
        ctx.fillRect(x, y, barWidth - 1, h - y);
      }
    },
    inputstop: function () {
      this._stream.getTracks().forEach((track) => track.stop());
      self.started = false;
    },
    inputs: {
      start: {
        type: 'bang',
        description: 'start mic',
      },
      stop: {
        type: 'bang',
        description: 'stop mic',
      },
    },
    outputs: {
      audio: {
        type: 'audio',
      },
      low: {
        type: 'number',
      },
      mid: {
        type: 'number',
      },
      high: {
        type: 'number',
      },
    },
  });
});
