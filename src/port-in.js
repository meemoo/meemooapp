$(function(){

  Iframework.PortIn = Iframework.Port.extend({
    defaults: {
      name: "",
      type: "",
      description: "",
      "default": null
    },
    initializeView: function () {
      return this.view = new Iframework.PortInView({model:this});
    },
    // Input ports get message
    receive: function (message) {
      // TODO type conversions
      var m = {};
      m[this.id] = message;
      this.node.receive(m); 
    }
  });
  
  Iframework.PortsIn = Backbone.Collection.extend({
    model: Iframework.PortIn
  });

});
