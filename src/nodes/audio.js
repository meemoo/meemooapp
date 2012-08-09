// extends src/node-box-native-view.js

$(function(){

  var template = '<div class="info" />';

  Iframework.NativeNodes["audio"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    info: {
      title: "audio",
      description: "extend me"
    },
    initializeCategory: function() {
    }

  });


});
