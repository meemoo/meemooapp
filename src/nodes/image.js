// extends src/node-box-native-view.js

$(function(){

  var template = 
    // '<canvas id="canvas-<%= id %>" class="canvas" width="500" height="500" style="max-width:100%;" />'+
    '<div class="info" />';
    // '<input type="checkbox" checked="checked" class="showpreview" id="showpreview-<%= id %>" />'+
    // '<label for="showpreview-<%= id %>">show preview</label>';

  Iframework.NativeNodes["image"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    canvas: null,
    context: null,
    // events: {
    //   "click .showpreview": "togglePreview"
    // },
    initializeCategory: function() {
      this.canvas = document.createElement("canvas");
      this.canvas.width = 500;
      this.canvas.height = 500;
      this.context = this.canvas.getContext('2d');
      this.showCanvas();
    },
    scale: function(){
      // canvas is shown at this scaling factor
      // useful for absolute positioning other elements over the canvas
      return this.$(".canvas").width() / this.canvas.width;
    },
    outputs: {
      image: {
        type: "image"
      }
    },
    showCanvas: function(){
      $(this.canvas).attr({
        "class": "canvas",
        "id": "canvas-"+this.model.id,
        "style": "max-width:100%"
      });      
      this.$el.prepend(this.canvas);
    }
    //,
    // togglePreview: function(e){
    //   if (e.target.checked) {
    //     this.$el.prepend(this.canvas);
    //   } else {
    //     this.$("canvas").remove();
    //   }
    // }

  });


});
