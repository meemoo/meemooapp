$(function(){

  var template = 
    '<div class="edges">'+
      '<svg id="edgesSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>'+
    '</div>'+
    '<div class="nodes" />';

  Iframework.GraphView = Backbone.View.extend({
    tagName: "div",
    className: "graph",
    template: _.template(template),
    events: {
      "click": "click"
    },
    initialize: function () {
      this.render();
      Iframework.$el.prepend(this.el);

      this.model.get("nodes").each(this.addNode);
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    click: function (event) {
      // Hide dis/connection boxes
      $(".edge-edit").remove();
      Iframework.selectedPort = null;
      
      // Unactivate modules
      $("div.module").removeClass("active");
    },
    addNode: function (node) {
      this.$(".nodes").append( node.initializeView().el );
    },
    addEdge: function (edge) {
      edge.initializeView();
      // this.$(".edges").append( edge.initializeView().el );
    },
    removeNode: function (node) {
      if (node.view) {
        node.view.$el.remove();
      }
    },
    removeEdge: function (edge) {
      if (edge.view) {
        edge.view.remove();
      }
    }
    
  });

});
