$(function(){

  var innerTemplate = '<iframe class="iframe" name="<%= frameIndex %>" src="<%= get("src") %>"></iframe>';

  Iframework.NodeBoxIframeView = Iframework.NodeBoxView.extend({
    innerTemplate: _.template(innerTemplate),
    initialize: function () {
      // "super"
      Iframework.NodeBoxView.prototype.initialize.call(this);

      // Add refresh button
      this.$("button.remove")
        .after(
          $('<button type="button" class="refresh">refresh</button>')
            .button({ icons: { primary: "icon-cw" }, text: false })
        );
      // Add refresh event
      this.events["click .refresh"] = "refresh";

      // .inner style for css
      this.$(".inner").addClass("iframe-type");
    },
    render: function () {
      this.$el.html(this.template(this.model));
      this.$(".inner").html(this.innerTemplate(this.model));
      return this;
    },
    refresh: function () {
      this.$("iframe")[0].src = this.model.get("src");
    }

  });

});
