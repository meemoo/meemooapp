$(function(){

  var template = 
    '<div class="addnode button module-icon" title="<%= info.description %>"></div>' +
    '<h2 class="title" title="<%= src %>"><%= info.title %></h2>';

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

      var self = this;
      this.$(".addnode")
        .data({module: this.model})
        .draggable({
          helper: function () {
            var h = $('<div class="addnode-drag-helper module-icon" />')
              .data({
                "meemoo-drag-type": "library-module"
              });
              // .text( self.model.get("info")["title"]);
            if (self.model.isNative) {
              h.addClass("module-icon-"+self.model.groupAndName[0]+"-"+self.model.groupAndName[1]);
            }
            $(".app").append(h);
            return h;
          }
        });
      
      if (this.model.isNative) {
        this.$(".addnode").addClass("module-icon-"+this.model.groupAndName[0]+"-"+this.model.groupAndName[1]);
      }

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
