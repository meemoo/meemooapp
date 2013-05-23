// extends src/node-box-native-view.js

$(function(){

  var template = 
    // '<canvas id="canvas-<%= id %>" class="canvas" width="500" height="500" style="max-width:100%;" />'+
    '<div class="info" />';

  Iframework.NativeNodes["image"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    canvas: null,
    context: null,
    initializeCategory: function() {
      // Add popout button to box
      var self = this;
      this.model.view.$("button.remove")
        .after(
          $('<button title="popout" type="button" class="popout icon-popup"></button>')
            // .button({ icons: { primary: "icon-popup" }, text: false })
            .click(function(){
              self.popout();
            })
        );

      this.canvas = document.createElement("canvas");
      this.canvas.width = 10;
      this.canvas.height = 10;
      this.context = this.canvas.getContext('2d');

      $(this.canvas)
        .attr({
          "class": "canvas",
          "id": "canvas-"+this.model.id
        })
        .css({
          maxWidth: "100%",
          cursor: "pointer"
        })
        .draggable({
          cursor: "pointer",
          cursorAt: { top: -10, left: -10 },
          helper: function( event ) {
            var helper = $( '<div class="drag-image"><h2>Copy this</h2></div>' )
              .data({
                "meemoo-drag-type": "canvas",
                "meemoo-source-node": self
              });
            $(document.body).append(helper);
            _.delay(function(){
              self.dragCopyCanvas(helper);
            }, 100);
            return helper;
          }
        });

      // If there is an image input
      var firstImageInput;
      for (var name in this.inputs) {
        if (this.inputs[name].type==="image"){
          firstImageInput = name;
          break;
        }
      }

      // Setup droppable
      if (firstImageInput) {
        // Add drop indicator (shown in CSS)
        this.$el.append('<div class="drop-indicator"><p class="icon-login">input '+firstImageInput+'</p></div>');
        
        // Make droppable        
        this.$el.droppable({
          accept: ".canvas, .meemoo-plugin-images-thumbnail",
          tolerance: "pointer",
          hoverClass: "drop-hover",
          activeClass: "drop-active",
          // Don't also drop on graph
          greedy: true
        });
        this.$el.on("drop", {"self": this, "inputName": firstImageInput}, Iframework.util.imageDrop);
      }

      this.$el.prepend(this.canvas);
    },
    dragCopyCanvas: function(helper) {
      if (!helper) { return; }
      var canvasCopy = document.createElement("canvas");
      canvasCopy.width = this.canvas.width;
      canvasCopy.height = this.canvas.height;
      canvasCopy.getContext("2d").drawImage(this.canvas, 0, 0);
      helper.data("meemoo-drag-canvas", canvasCopy);
      helper.append(canvasCopy);
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
    _smoothing: true,
    inputsmoothing: function (s) {
      this._smoothing = s;
      // HACK browser-specific stuff
      this.context.webkitImageSmoothingEnabled = s;
      this.context.mozImageSmoothingEnabled = s;
    },
    exportImage: function(){
      try {
        var url = this.canvas.toDataURL();
        window.open(url);
      } catch (e) {
        // Maybe it is dirty with non-CORS data
      }
    },
    popout: function() {
      if (this.w) {
        // Toggle
        this.popin();
        return false;
      }

      // Cache local canvas
      this.localCanvas = this.canvas;
      this.localContext = this.context;
      // $(this.localCanvas).hide();

      // Open new window to about:blank
      this.w = window.open("", "meemooRemoteWindow", "menubar=no,location=no,resizable=yes,scrollbars=no,status=no");
      var self = this;
      this.w.addEventListener("unload", function(){
        self.popin();
      });

      // Popin other
      if (Iframework.popoutModule && Iframework.popoutModule !== this) {
        Iframework.popoutModule.popin();
      }
      Iframework.popoutModule = this;
      // TODO: fade out other canvas?
      this.w.document.body.innerHTML = "";

      // Make new canvas
      this.canvas = this.w.document.createElement("canvas");
      this.canvas.width = this.localCanvas.width;
      this.canvas.height = this.localCanvas.height;
      this.context = this.canvas.getContext('2d');
      this.context.drawImage(this.localCanvas, 0, 0);
      this.w.document.body.appendChild(this.canvas);

      // Full-screen styling
      this.w.document.body.style.backgroundColor="black";
      this.w.document.body.style.overflow = "hidden";
      this.w.document.body.style.margin="0px";
      this.w.document.body.style.padding="0px";
      this.w.document.title = "meemoo.org";
      this.canvas.style.position="absolute";
      this.canvas.style.top="0px";
      this.canvas.style.left="0px";
      this.canvas.style.width="100%";

      // Smoothing on new canvas
      this.inputsmoothing(this._smoothing);

      return false;
    },
    popin: function() {
      if (this.w) {
        this.w = null;
      }
      this.canvas = this.localCanvas;
      this.context = this.localContext;
      // $(this.canvas).show();

      // Smoothing on canvas (only matters if it changed while out)
      this.inputsmoothing(this._smoothing);

      return false;
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
