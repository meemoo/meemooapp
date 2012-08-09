$(function(){

  var template = 
    '<div class="addnode" type="button">drag to graph</div>' +
    '<h2 class="title"><%= info.title %></h2>' +
    '<p class="description"><%= info.description %></p>' +
    '<p class="src"><%= src %></p>';

  Iframework.ModuleView = Backbone.View.extend({
    tagName: "div",
    className: "library-module",
    template: _.template(template),
    events: {
      "click .addnode":     "addNode",
      "dragstart .addnode": "dragStart",
      "dragstop .addnode":  "dragStop"
    },
    initialize: function () {
      this.render();

      this.$(".addnode")
        .data({module: this.model})
        .button({ icons: { primary: 'icon-window' }, text: false })
        .draggable({
          helper: function () {
            var h = $('<div class="addnode-drag-helper" />')
              .text($(this).data("module").get("info")["title"]);
            $(".app").append(h);
            return h;
          }
        });
      return this;
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
    },
    addNode: function(options) {
      Iframework.$(".addbyurlinput").val( this.model.get("src") );
      Iframework.addByUrl(options);
    },
    dragAddNode: function(options) {
      // options has x and y from GraphView.drop()
      options.src = this.model.get("src");
      Iframework.shownGraph.addNode( options );
    },
    dragStart: function() {
      Iframework.shownGraph.view.maskFrames();
    },
    dragStop: function() {
      Iframework.shownGraph.view.unmaskFrames();
    }

  });

});
