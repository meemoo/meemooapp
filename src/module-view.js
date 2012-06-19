$(function(){

  var template = 
    '<button class="addnode" type="button">add node</button>' +
    '<h2 class="title"><%= info.title %></h2>' +
    '<p class="description"><%= info.description %></p>' +
    '<p class="src"><%= src %></p>';

  Iframework.ModuleView = Backbone.View.extend({
    tagName: "div",
    className: "librarymodule",
    template: _.template(template),
    events: {
      "click .addnode": "addnode"
    },
    initialize: function () {
      this.render();
      Iframework.$(".panel .library .listing").append( this.el );
      this.$(".addnode")
        .button({ icons: { primary: 'ui-icon-plus' }, text: false });
      return this;
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
    },
    addnode: function() {
      Iframework.$(".addbyurlinput").val( this.model.get("src") );
      Iframework.addByUrl();
    }

  });

});
