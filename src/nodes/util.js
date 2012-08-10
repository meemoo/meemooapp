// extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="info" />';

  Iframework.NativeNodes["util"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    initializeCategory: function() {
    }

  });


});
