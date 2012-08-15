// extends src/nodes/audio.js which extends src/node-box-native-view.js

// Iframework.audioContext is the global audio context!

$(function(){

  var template = '<div class="audio-delay">audio delay</div>';

  Iframework.NativeNodes["audio-delay"] = Iframework.NativeNodes["audio"].extend({
    template: _.template(template),
    info: {
      title: "audio-delay",
      description: "audio delay"
    },
    initializeModule: function(){
      this.audioContext = Iframework.audioContext;
      this.createAudioNode();
    },

    createAudioNode: function () {
      this.audioNode = this.audioContext.createDelayNode();
      this.audioNode.delayTime.value = 0.2;
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
