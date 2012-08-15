// extends src/nodes/audio.js which extends src/node-box-native-view.js

// Iframework.audioContext is the global audio context!

$(function(){

  var template = '<div class="audio-gain">audio gain</div>';

  Iframework.NativeNodes["audio-gain"] = Iframework.NativeNodes["audio"].extend({
    template: _.template(template),
    info: {
      title: "audio-gain",
      description: "audio gain"
    },
    initializeModule: function(){
      this.audioContext = Iframework.audioContext;
      this.createAudioNode();
    },

    createAudioNode: function () {
      this.audioNode = this.audioContext.createGainNode();
      this.audioNode.gain.value = 0.5;
    },

    inputaudio: function (source) {
      // when we got an audio connection, we propagate to the target
      source.connect(this.audioNode);
      this.send("audio", this.audioNode);
    },

    inputs: {
      audio: {
        type: "audio",
        description: "input audio"
      }
    },

    outputs: {
      audio: {
        type: "audio",
      }
    }
  });


});
