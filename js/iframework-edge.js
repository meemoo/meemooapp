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
    source: null,
    target: null,
    connect: function () {
      // IDs from the graph
      for (var i=0; i<this.graph.get("nodes").length; i++) {
        if (this.graph.get("nodes").at(i).get("id") === this.get("source")[0]) {
          this.source = this.graph.get("nodes").at(i).outputs.findByName( this.get("source")[1] );
        }
        if (this.graph.get("nodes").at(i).get("id") === this.get("target")[0]) {
          this.target = this.graph.get("nodes").at(i).inputs.findByName( this.get("target")[1] );
        }
      }
      if (!this.source || !this.target) {
        return false;
      }
      this.source.node.send({
        connect: { 
          source: this.get("source"),
          target: [this.target.node.frameIndex, this.get("target")[1]]
        }
      });
      if (this.source.node.view) {
        this.source.view._relatedEdges = null;
      }
      if (this.target.node.view) {
        this.target.view._relatedEdges = null;
      }
      if (this.graph.view) {
        this.graph.view.addEdge(this);
      }
      return this;
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
