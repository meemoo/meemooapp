/*jshint newcap:false*/
/*global AudioContext:true, webkitAudioContext:true*/
// extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="info" />';

  Iframework.NativeNodes["audio"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    initializeCategory: function() {
      // See if an AudioContext is initialized
      if (Iframework.audioContext) {
        this.audioContext = Iframework.audioContext;
      } else {
        var audioContext;
        if (typeof AudioContext !== "undefined") {
          audioContext = new AudioContext();
        } else if (typeof webkitAudioContext !== "undefined") {
          audioContext = new webkitAudioContext();
        } else {
          throw new Error('AudioContext not supported. :(');
        }
        if (audioContext) {
          Iframework.audioContext = this.audioContext = audioContext;
        }
      }
    }
    
  });


});
