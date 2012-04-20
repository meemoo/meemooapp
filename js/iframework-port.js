$(function(){

  Iframework.Port = Backbone.Model.extend({
    defaults: {
      name: "",
      type: "",
      description: "",
      default: null
    },
    initialize: function () {
      if (this.get("type")==="") {
        // No type set, connect to anything
        this.set("type", "all");
      }
      // To sanitize data:image/gif types for css class
      this.set( "type_class", this.get("type").split("/")[0].replace(":", "_") );
    },
    initializeView: function () {
      return this.view = new Iframework.PortView({model:this});
    }
  });
  
  Iframework.Ports = Backbone.Collection.extend({
    model: Iframework.Ports,
    findByName: function (name) {
      return this.find( function(_port){
        return _port.get("name")===name;
      });
      return false;
    }
  });

});
