// extends src/node-box-native-view.js

$(function(){

  var innerTemplate = 
    '<canvas id="canvas-<%= id %>" class="canvas" width="500" height="500" style="max-width:100%;" />'+
    '<div class="info" />';

  Iframework.NativeNodes["image"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(innerTemplate),
    canvas: null,
    context: null,
    initializeCategory: function() {
      this.canvas = this.$(".canvas")[0];
      this.context = this.canvas.getContext('2d');
    },
    scale: function(){
      // canvas is shown at this scaling factor
      // useful for absolute positioning other elements over the canvas
      return this.$(".canvas").width() / this.canvas.width;
    }

  });


});
