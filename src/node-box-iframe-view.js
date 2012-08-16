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

      // Add detach button
      this.$("button.remove")
        .after(
          $('<button type="button" class="detach">detach</button>')
            .button({ icons: { primary: "icon-up-open" }, text: false })
        );
      // Add detach event
      this.events["click .detach"] = "detach";


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
    },

    detach: function () {
      var newWindow = 
        window.open(this.model.get("src"),
                    this.model.info.title,
                    'width='+this.model.get("w")+
                    ',height='+this.model.get("h"));

      // store the new window reference on a node state
      this.model.set({"detachWindow": newWindow});
    }

  });

});
