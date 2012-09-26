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
    },
    _smoothing: true,
    inputsmoothing: function (s) {
      if (this._smoothing !== s) {
        this._smoothing = s;
        // HACK browser-specific stuff
        this.context.webkitImageSmoothingEnabled = s;
        this.context.mozImageSmoothingEnabled = s;
      }
    }
    // showResizer: function(translateX, translateY, scale, rotate){
    //   if (!this.resizer) {
    //     this.resizer = $('<div class="resizer">');
    //     this.$el.append(this.resizer);        
    //   }
    //   var sizedScale = this.scale();
    //   this.resizer
    //     .css({
    //       position: "absolute",
    //       border: "1px solid black",
    //       top: translateX * sizedScale,
    //       left: translateY * sizedScale,
    //       width: 20,
    //       height: 20
    //     });
    //     // .hide();
    //   var self = this;
    //   // $(this.canvas)
    //   //   .mouseover(function(){
    //   //     self.resizer.show();
    //   //   })
    //   //   .mouseout(function(){
    //   //     self.resizer.hide();
    //   //   });
    //   if (translateX || translateY) {
    //     this.resizer.draggable({});
    //   }
    //   if (scale) {
    //     this.resizer.resizable({});
    //   }
    // }
    // togglePreview: function(e){
    //   if (e.target.checked) {
    //     this.$el.prepend(this.canvas);
    //   } else {
    //     this.$("canvas").remove();
    //   }
    // }

  });


});
