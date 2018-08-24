$(function() {
  var template =  '<div class="info" />' +
    '<button class="start">start capture</button>' +
    '<button class="stop">stop</button><br />' +
    '<video class="video" autoplay controls style="max-width: 100%"/>' +
    '<div class="videos" />';

  Iframework.NativeNodes['file-webm'] = Iframework.NativeNodes['file'].extend({
    template: _.template(template),
    info: {
      title: 'webm',
      description: 'encode canvas stream to WebM video'
    },
    initializeModule: function() {
      var self = this;
      this.$('.start')
        .button()
        .click(function() {
          self.inputstart();
        })
        .prop('disabled', true);
      this.$('.stop')
        .button()
        .click(function() {
          self.inputstop();
        })
        .prop('disabled', true);
      this.$('.video').hide();
      if (!window.MediaRecorder) {
        this.$('.info').text(
          'Unsupported browser: https://caniuse.com/#feat=mediarecorder'
        );
      }
    },
    _image: null,
    inputimage: function(image) {
      if (image !== this._image) {
        this._image = image;
        this.$('.start').prop('disabled', false);
      }
    },
    inputstart: function() {
      this.$('.start').prop('disabled', true);
      this.$('.stop').prop('disabled', false);

      if (!MediaRecorder || !this._image || !this._image.captureStream) return;

      // Check support
      var options;
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options = {mimeType: 'video/webm; codecs=vp9'};
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options = {mimeType: 'video/webm'};
      } else {
        return;
      }

      var stream = this._image.captureStream(this._fps);

      var recordedChunks = [];
      this._recordedChunks = recordedChunks;

      mediaRecorder = new MediaRecorder(stream, options);
      this._mediaRecorder = mediaRecorder;
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start();

      var self = this;
      function handleDataAvailable(event) {
        console.log(event, event.data.size);
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
        if (event.target.state === 'inactive') {
          // MediaRecorder.stop() hits this codepath
          self.makeUrl();
        }
      }
    },
    inputstop: function() {
      this.$('.start').prop('disabled', false);
      this.$('.stop').prop('disabled', true);
      if (!this._mediaRecorder) return;
      this._mediaRecorder.stop();
    },
    makeUrl: function() {
      var buffer = new Blob(this._recordedChunks, {
        type: 'video/webm'
      });
      var url = window.URL.createObjectURL(buffer);

      // Send blob URL
      this.send('url', url);

      // Info
      var size = Math.ceil(buffer.size / 2014);
      var info = $(
        '<p><a href="${url}" target="_blank" download="meemoo.webm">Download</a> ☙ ' +
        String(size) +
        'kb</p>'
      );

      // TODO: delete option w/ window.URL.revokeObjectURL(url);
      this.$('.videos').prepend(info);

      this.$('.video')
        .attr('src', url)
        .show();
    },
    inputs: {
      image: {
        type: 'image',
        description: 'canvas to be captured to the webm video'
      },
      fps: {
        type: 'int',
        description: 'framerate in frames per second',
        'default': 30
      },
      start: {
        type: 'bang',
        description: 'start capturing frames into a video'
      },
      stop: {
        type: 'bang',
        description: 'stop capturing frames, save video'
      }
    },
    outputs: {
      url: {
        type: 'string',
        description: 'local blob url of video'
      }
    }
  });
});
