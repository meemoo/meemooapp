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
      // To sanitize data:image/gif types for css class
      this.set( "type_class", this.get("type").split("/")[0].replace(":", "_") );
      this.Edges = new Iframework.Edges();
    },
    initializeView: function () {
      return this.view = new Iframework.PortView({model:this});
    },
    // Ports keep track of connected edges
    connect: function (edge) {
      this.Edges.add(edge);
    },
    disconnect: function (edge) {
      this.Edges.remove(edge);
    },
    // Output ports send messages
    send: function (message) {
      this.Edges.each(function(edge){
        edge.Target.recieve(message);
      });
    },
    // Input ports get message
    recieve: function (message) {
      // TODO type conversions
      var m = {};
      m[this.id] = message;
      this.node.recieve(m); 
      // this.node.recieve(m);
    }
  });
  
  Iframework.Ports = Backbone.Collection.extend({
    model: Iframework.Ports,
    findByName: function (name) {
      return this.find( function(_port){
        return _port.get("name")===name;
      });
    }
  });

});
