$(function(){

  Iframework.PortOut = Iframework.Port.extend({
    defaults: {
      name: "",
      type: "",
      description: "",
      "default": null
    },
    initializeView: function () {
      return this.view = new Iframework.PortOutView({model:this});
    }
  });
  
  Iframework.PortsOut = Backbone.Collection.extend({
    model: Iframework.PortOut
  });

});
