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
      // Make internal canvas to pass
      if (this.get("type")==="image" && Iframework.util.type(message)==="ImageData") {
        if (!this.canvas) {
          this.canvas = document.createElement("canvas");
          this.context = this.canvas.getContext('2d');
        }
        if (this.canvas.width !== message.width || this.canvas.height !== message.height) {
          this.canvas.width = message.width;
          this.canvas.height = message.height;
        }
        this.context.putImageData(message, 0, 0);
      }
      var self = this;
      this.Edges.each(function(edge){
        _.defer(function(){
          if(self.canvas && edge.Target.node.view.Native) {
            // Send canvas ref to native nodes
            edge.Target.recieve(self.canvas);
          } else if (self.get("type")==="image" && !edge.Target.node.view.Native && Iframework.util.type(message)==="HTMLCanvasElement") {
            // Send image data to iframe nodes
            var d = message.getContext("2d").getImageData(0, 0, message.width, message.height);
            edge.Target.recieve(d);
          } else {
            edge.Target.recieve(message);            
          }
        });
      });
    },
    // Input ports get message
    recieve: function (message) {
      // TODO type conversions
      var m = {};
      m[this.id] = message;
      this.node.recieve(m); 
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
