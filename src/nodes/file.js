// extends src/node-box-native-view.js

$(function(){

  var template = '<div class="info" />';

  Iframework.NativeNodes["file"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    info: {
      title: "file",
      description: "extend me"
    },
    initializeCategory: function() {
    }

  });


});
