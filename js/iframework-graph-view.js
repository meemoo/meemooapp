$(function(){

  var template = 
    '<div class="edges" />'+
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
      this.$(".edges").append( edge.initializeView().el );
    },
    removeEdge: function (edge) {
      edge.view.$el.remove();
    }
    
  });

});
