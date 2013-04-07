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
    }
  });
  
  Iframework.PortsIn = Backbone.Collection.extend({
    model: Iframework.PortIn
  });

});
