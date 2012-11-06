// extends src/node-box-native-view.js

$(function(){

  var template = 
    // '<canvas id="canvas-<%= id %>" class="canvas" width="500" height="500" style="max-width:100%;" />'+
    '<div class="info" />';

  Iframework.NativeNodes["view"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    initializeCategory: function() {
      // Add popout button to box
      var self = this;
      this.model.view.$("button.remove")
        .after(
          $('<button type="button" class="popout">popout</button>')
            .button({ icons: { primary: "icon-popup" }, text: false })
            .click(function(){
              self.popout();
            })
        );
    },
    outputs: {
      image: {
        type: "image"
      }
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

      return false;
    },
    popin: function() {
      if (this.w) {
        this.w = null;
      }
      
      return false;
    }

  });


});
