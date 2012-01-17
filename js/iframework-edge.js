$(function(){

  Iframework.Edge = Backbone.Model.extend({
    defaults: {
      source: [0, "default"], 
      target: [0, "default"]
    },
    initialize: function () {
    },
    initializeView: function () {
      this.view = new Iframework.EdgeView({model:this});
      return this.view;
    },
    connect: function () {
      // IDs from the graph
      for (var i=0; i<this.graph.get("nodes").length; i++) {
        if (this.graph.get("nodes").at(i).get("id") === this.get("source")[0]) {
          this.source = this.graph.get("nodes").at(i);
        }
        if (this.graph.get("nodes").at(i).get("id") === this.get("target")[0]) {
          this.target = this.graph.get("nodes").at(i);
        }
      }
      this.source.send({
        connect: { 
          source: this.get("source"),
          target: [this.target.frameIndex, this.get("target")[1]]
        }
      });
      if (this.source.view) {
        this.source.view._relatedEdges = null;
      }
      if (this.target.view) {
        this.target.view._relatedEdges = null;
      }
      if (this.graph.view) {
        this.graph.view.addEdge(this);
      }
    },
    disconnect: function () {
      if (this.source && this.target) {
        this.source.send({
          disconnect: { 
            source: this.get("source"),
            target: [this.target.frameIndex, this.get("target")[1]]
          }
        });
      }
      if (this.view) {
        this.view.remove();
      }
    }
  });
  
  Iframework.Edges = Backbone.Collection.extend({
    model: Iframework.Edge
  });

});
