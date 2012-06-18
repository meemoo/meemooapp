$(function(){

  var template = 
    '<button class="loadapp" type="button">load</button>' +
    // '<button class="edit" type="button">edit</button>' +
    '<h2 class="title"><%= graph.info.title %></h2>' +
    '<p class="description"><%= graph.info.description %></p>' +
    '<p class="url"><%= graph.info.url %></p>';

  Iframework.LocalAppView = Backbone.View.extend({
    tagName: "div",
    className: "localapp",
    template: _.template(template),
    events: {
      "click .loadapp": "loadapp"
    },
    initialize: function () {
      this.render();
      Iframework.$(".localapps").append( this.el );
      this.$(".loadapp")
        .button({ icons: { primary: 'ui-icon-copy' }, text: false });
      return this;
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
    },
    loadapp: function() {
      Iframework.loadGraph(this.model.get("graph"));
    }

  });

});
