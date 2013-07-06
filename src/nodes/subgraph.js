// extends src/node-box-native-view.js

$(function(){

  var template = '<div class="info" />';

  Iframework.NativeNodes["subgraph"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    info: {
      title: "subgraph",
      description: "extend me"
    },
    initializeCategory: function() {
    }

  });


});
