$(function(){

  window.Iframework.GraphView = Backbone.View.extend({
    tagName: "div",
    className: "app",
    template: _.template($('#graph-template').html()),
    events: {
      "click .graph":     "click"
    },
    initialize: function () {
      this.render();
      $('body').append(this.el);
      
      this.model.get("nodes").each(this.addNode);
      
      // Panel buttons
      this.$(".panel .code").hide();
      this.$(".panel .close").button({
        icons: {
          primary: 'ui-icon-close'
        }
      }).click( function(){
        $(".panel .code").hide();
        $(".panel .source").show();
      });
      
      this.$(".panel .source").button({
        icons: {
          primary: 'ui-icon-gear'
        }
      }).click( function(){
        $(".panel .source").hide();
        $(".panel .code").show();
        $(".panel .code textarea").text( JSON.stringify(Iframework.shownGraph, null, 2) );
      });
      
      this.$(".panel .apply").button({
        icons: {
          primary: 'ui-icon-check'
        }
      }).click( function(){
        var newGraph = JSON.parse( $(".panel .sourceedit").val() );
        window.Iframework.showGraph(newGraph);
        $(".panel .source").click();
      });
    },
    click: function (event) {
      if (!$(event.target).hasClass("hole") && !$(event.target).parents().hasClass("edge-edit") && !$(event.target).parents().hasClass("hole")) {
        // Hide dis/connection boxes
        $(".edge-edit").remove();
        window.Iframework.selectedPort = null;
      }
    },
    render: function () {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    addNode: function (node) {
      this.$(".nodes").append( node.initializeView().el );
      node.frameIndex = window.frames.length - 1;
    },
    addEdge: function (edge) {
      this.$(".edges").append( edge.initializeView().el );
    },
    removeEdge: function (edge) {
      $(edge.view.el).remove();
    }
    
  });

});
