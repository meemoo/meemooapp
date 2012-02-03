$(function(){

  Iframework.Port = Backbone.Model.extend({
    defaults: {
      name: "",
      type: "",
      description: "",
      default: null
    },
    initialize: function () {
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
