// extends src/node-box-native-view.js

$(function(){

  var template = 
    '<video id="video-<%= id %>" class="video" style="max-width:100%;" />'+
    '<button >'+
    '<div class="info" />';

  Iframework.NativeNodes["video"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    initializeCategory: function() {
    }

  });


});
