$(function(){

  // var innerTemplate = '<iframe class="iframe" name="<%= frameIndex %>" src="<%= get("src") %>"></iframe>';

  Iframework.NodeBoxIframeView = Iframework.NodeBoxView.extend({
    // innerTemplate: _.template(innerTemplate),
    initialize: function () {
      // "super"
      Iframework.NodeBoxView.prototype.initialize.call(this);

      // Add refresh button
      this.$("button.remove")
        .after(
          $('<button title="reload iframe" type="button" class="refresh icon-cw"></button>')
        );
      // Add refresh event
      this.events["click .refresh"] = "refresh";

      // .inner style for css
      this.$(".inner").addClass("iframe-type");

      var self = this;
      this.iframe.onload = function () {
        self.iframeloaded = true;
      };
    },
    render: function () {
      this.$el.html(this.template(this.model));

      this.iframe = document.createElement("iframe");

      $(this.iframe).attr({
        "class": "iframe",
        "name": this.model.frameIndex,
        "src": this.model.get("src")
      });

      this.$(".inner").html( this.iframe );
      return this;
    },
    refresh: function () {
      this.$("iframe")[0].src = this.model.get("src");
    }

  });

});
