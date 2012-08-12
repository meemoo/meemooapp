// extends src/nodes/audio.js which extends src/node-box-native-view.js

$(function(){

  var template = '<div id="audio-output"></div>';

  Iframework.NativeNodes["audio-output"] = Iframework.NativeNodes["audio"].extend({
    template: _.template(template),
    info: {
      title: "audio-output",
      description: "global audio output"
    },
    initializeModule: function(){
      try {
        if (!Iframework.audioContext) {
          Iframework.audioContext = new webkitAudioContext();
        }
      } catch(e) {
        alert("Web Audio API is not supported in this browser.");
      }

      if (!Iframework.audioContext.createOscillator) {
        alert('Oscillators not supported - you may need to run Chrome Canary.');
      }
      
      var dest = document.getElementById("audio-output");
      dest.audioNode = Iframework.audioContext.destination;
    },
    inputs: {
      input: {
        type: "audio",
        description: "audio input"
      },
    },
    outputs: {
      output: {
        type: "audio"
      }
    }

  });


});
