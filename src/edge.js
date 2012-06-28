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
    connectTryCount: 5,
    connect: function () {
      // Called from graph.connectEdges()
      // IDs from the graph
      for (var i=0; i<this.graph.get("nodes").length; i++) {
        if (this.graph.get("nodes").at(i).get("id") === this.get("source")[0]) {
          this.source = this.graph.get("nodes").at(i).Outputs.findByName( this.get("source")[1] );
        }
        if (this.graph.get("nodes").at(i).get("id") === this.get("target")[0]) {
          this.target = this.graph.get("nodes").at(i).Inputs.findByName( this.get("target")[1] );
        }
      }
      if (!this.source || !this.target) {
        console.warn("Edge source or target port not found, try #"+this.connectTryCount+": "+this.toString());
        if (this.connectTryCount > 0) {
          this.connectTryCount--;
          _.delay(_.bind(this.connect, this), 1000);
        }
        return false;
      }
      this.source.node.send({
        connect: { 
          source: [this.source.node.frameIndex, this.get("source")[1]],
          target: [this.target.node.frameIndex, this.get("target")[1]]
        }
      });
      if (this.graph.view) {
        this.graph.view.addEdge(this);
      }
      return this;
    },
    disconnect: function () {
      // Called from graph.removeEdge()
      if (this.source && this.target) {
        this.source.node.send({
          disconnect: { 
            source: [this.source.node.frameIndex, this.get("source")[1]],
            target: [this.target.node.frameIndex, this.get("target")[1]]
          }
        });
      }
      if (this.view) {
        this.view.remove();
      }
    },
    remove: function(){
      this.graph.removeEdge(this);
    },
    toString: function(){
      return this.get("source")[0]+":"+this.get("source")[1]+"->"+this.get("target")[0]+":"+this.get("target")[1];
    }
  });
  
  Iframework.Edges = Backbone.Collection.extend({
    model: Iframework.Edge
  });

});
