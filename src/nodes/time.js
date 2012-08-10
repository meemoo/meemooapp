// extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="info" />';

  Iframework.NativeNodes["time"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    initializeCategory: function() {
    }

  });


});
