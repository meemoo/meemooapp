$(function(){

  Iframework.Port = Backbone.Model.extend({
    defaults: {
      name: "",
      type: "",
      description: "",
      "default": null
    },
    initialize: function () {
      if (this.get("type")==="") {
        // No type set, connect to anything
        this.set("type", "all");
      }
      this.parentNode = this.get("parentNode");
      // To sanitize data:image/gif types for css class
      // this.set( "type_class", this.get("type").split("/")[0].replace(":", "_") );
      this.set( "type_class", this.get("type").split(":")[0] );
      this.Edges = new Iframework.Edges();

    },
    // Ports keep track of connected edges
    connect: function (edge) {
      this.Edges.add(edge);
    },
    disconnect: function (edge) {
      this.Edges.remove(edge);
    },
    remove: function () {
      // Disconnect edges
      while(this.Edges.length > 0) {
        var edge = this.Edges.at(0);
        this.parentNode.parentGraph.removeEdge(edge);
      }
      // Remove view
      if (this.view) {
        this.view.remove();
      }
    }
  });
  
  Iframework.Ports = Backbone.Collection.extend({
    model: Iframework.Port
  });

});
