// extends src/node-box-native-view.js

$(function(){

  var template = 
    // '<canvas id="canvas-<%= id %>" class="canvas" width="500" height="500" style="max-width:100%;" />'+
    '<div class="info" />';

  // Iframework.NativeNodes["webgl"] = Iframework.NativeNodes["image"].extend({
  Iframework.NativeNodes["webgl"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    canvas: null,
    context: null,
    initializeCategory: function() {
      // "super"
      // Iframework.NativeNodes["image"].prototype.initialize.call(this);

      var self = this;
      this.model.view.$("button.remove")
        .after(
          $('<button type="button" class="popout">popout</button>')
            .button({ icons: { primary: "icon-popup" }, text: false })
            .click(function(){
              self.popout();
            })
        );

      this.canvas = document.createElement("canvas");
      this.canvas.width = 800;
      this.canvas.height = 600;

      this.canvas.style.maxWidth = "100%";

      // Init GL
      try {
        this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        this.gl.viewportWidth = this.canvas.width;
        this.gl.viewportHeight = this.canvas.height;
      } catch (e) {
        this.$(".info").text("WebGL fail :-(");
      }

      this.$el.prepend(this.canvas);
    },
    popout: function() {
      if (this.w) {
        // Toggle
        this.popin();
        return false;
      }

      // Open new window to about:blank
      this.w = window.open("", "meemooRemoteWindow", "menubar=no,location=no,resizable=yes,scrollbars=no,status=no");
      var self = this;
      this.w.addEventListener("unload", function(){
        self.popin();
      });

      // Style
      this.w.document.body.style.backgroundColor = "black";
      this.w.document.body.style.overflow = "hidden";
      this.w.document.title = "meemoo.org";

      // Empty it
      var el = this.w.document.body;
      while (el.hasChildNodes()){
        el.removeChild(el.lastChild);
      }

      this.w.document.body.appendChild(this.canvas);

      return false;
    },
    popin: function() {
      if (this.w) {
        this.w = null;
      }

      this.$el.prepend(this.canvas);
      
      return false;
    }


  });


});
