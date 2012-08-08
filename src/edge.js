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
    Source: null,
    Target: null,
    connectTryCount: 5,
    connect: function () {
      // Called from graph.connectEdges()
      // IDs from the graph
      for (var i=0; i<this.graph.get("nodes").length; i++) {
        if (this.graph.get("nodes").at(i).get("id") === this.get("source")[0]) {
          this.Source = this.graph.get("nodes").at(i).Outputs.get( this.get("source")[1] );
        }
        if (this.graph.get("nodes").at(i).get("id") === this.get("target")[0]) {
          this.Target = this.graph.get("nodes").at(i).Inputs.get( this.get("target")[1] );
        }
      }
      if (!this.Source || !this.Target) {
        console.warn("Edge source or target port not found, try #"+this.connectTryCount+": "+this.toString());
        if (this.connectTryCount > 0) {
          this.connectTryCount--;
          _.delay(_.bind(this.connect, this), 1000);
        }
        return false;
      }
      this.Source.connect(this);
      this.Target.connect(this);
      this.Source.node.recieve({
        connect: { 
          source: [this.Source.node.id, this.Source.id],
          target: [this.Target.node.id, this.Target.id]
        }
      });
      if (this.graph.view) {
        this.graph.view.addEdge(this);
      }
      return this;
    },
    disconnect: function () {
      // Called from graph.removeEdge()
      if (this.Source && this.Target) {
        this.Source.disconnect(this);
        this.Target.disconnect(this);
        this.Source.node.recieve({
          disconnect: { 
            source: [this.Source.node.id, this.Source.id],
            target: [this.Target.node.id, this.Target.id]
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
