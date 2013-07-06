$(function(){

  var template = 
    '<a class="url" href="#local/<%= graph.info.url %>"></a> - '+
    '<a class="macro" title="load as subgraph into current graph" href="#">sub</a> ';
    // '<div class="info">'+
    //   '<h2 class="title"><%= graph.info.title %></h2>' +
    //   '<p class="description"><%= graph.info.description %></p>' +
    // '</div>';

  Iframework.LocalAppView = Backbone.View.extend({
    tagName: "div",
    className: "localapp",
    template: _.template(template),
    events: {
      "click .macro": "loadAsMacro"
    },
    initialize: function () {
      this.render();
      Iframework.$(".localapps").append( this.el );

      this.model.on('change', this.update, this);
      this.model.on('destroy', this.remove, this);

      return this;
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      this.$(".url").text( decodeURIComponent(this.model.get("graph")["info"]["url"]) );
      // this.$(".info").hide();
    },
    update: function () {
      this.render();
      Iframework.updateCurrentInfo();
    },
    loadAsMacro: function (event) {
      event.preventDefault();

      Iframework.shownGraph.addNode({
        src: "meemoo:subgraph/subgraph",
        state: {
          label: decodeURIComponent(this.model.get("graph")["info"]["url"]),
          graph: this.model.get("graph")
        }
      });

      return false;
    },
    remove: function () {
      this.$el.remove();
    }

  });

});
