// extends src/nodes/audio.js which extends src/node-box-native-view.js

// Iframework.audioContext is the global audio context!

$(function(){

  // TODO: make a drag-and-drop area to load buffers (see audio-array module)
  var template = '<div class="audio-source">audio source</div>';
  // we need a buffer to store the XHR request
  var buffer;

  Iframework.NativeNodes["audio-source"] = Iframework.NativeNodes["audio"].extend({
    template: _.template(template),
    info: {
      title: "audio-source",
      description: "audio source"
    },
    initializeModule: function(){
      // TODO: maybe load some example sounds here
      this.loadAudioBuffer("./audio/dj.wav");
      // internalize our global AudioContext
      this.audioContext = Iframework.audioContext;
      // create our AudioNode instance
      this.createAudioNode();
    },

    createAudioNode: function () {
      this.audioNode = Iframework.audioContext.createBufferSource();
    },

    loadAudioBuffer: function (url) {
      // asyncronously loads an arrayabuffer from an URL
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        Iframework.audioContext.decodeAudioData(request.response, function(b) {
          buffer = b;
        });
      };
      
      request.onerror = function() {
        console.log('Error while loading the Audio Buffer');
      };
      
      request.send();
    },

    inputnoteon: function (time) {
      // send our AudioNode instance to the target node (to connect)
      // TODO: some 'on connect' action would be interesting!
      this.send("audio", this.audioNode);
      
      // TODO: do we really need a BufferSource created everytime?
      this.loadAudioBuffer("./audio/dj.wav");
      this.createAudioNode();
      this.audioNode.buffer = buffer;
      // finally plays the buffer
      this.audioNode.noteOn(time);
    },

    inputs: {
      noteon: {
        type: "float",
        description: "note on at a specified time"
      }
    },

    outputs: {
      audio: {
        type: "audio"
      }
    }
  });


});
