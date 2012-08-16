// extends src/nodes/audio.js which extends src/node-box-native-view.js

$(function(){

  // TODO: maybe a volume analyzer as audio-output view?
  var template = '<div id="audio-output">audio output</div>';

  Iframework.NativeNodes["audio-output"] = Iframework.NativeNodes["audio"].extend({
    template: _.template(template),
    info: {
      title: "audio-output",
      description: "global audio output"
    },
    initializeModule: function(){
      try {
        if (!Iframework.audioContext) {
          // create the Audio Context and internalize
          Iframework.audioContext = new webkitAudioContext();
          this.audioContext = Iframework.audioContext;
          this.audioNode = this.audioContext.destination;
        }
      } catch(e) {
        console.log("Web Audio API is not supported in this browser.");
      }

      if (!Iframework.audioContext.createOscillator) {
        console.log('Oscillators not supported - you may need to run Chrome Canary.');      
      }
    },

    inputaudio: function (source) {
      source.connect(this.audioNode);
    },

    // TODO: every audio node has those in/outs? if yes, put on audio.js
    inputs: {
      audio: {
        type: "audio",
        description: "audio input"
      }
    },

    outputs: {
      audio: {
        type: "audio"
      }
    }

  });


});
