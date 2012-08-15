// extends src/node-box-native-view.js

$(function(){

  var template = '<div class="info" />';

  Iframework.NativeNodes["audio"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    // every audio mode has an Web Audio's AudioNode
    audioNode: null,
    // and maybe we can store the global audio context too
    audioContext: null,
    initializeCategory: function() {
      
    }

  });


});
