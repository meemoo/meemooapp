$(function(){

  Iframework.PortOut = Iframework.Port.extend({
    defaults: {
      name: "",
      type: "",
      description: "",
      "default": null
    },
    initializeView: function () {
      this.view = new Iframework.PortOutView({model:this});
      return this.view;
    }
  });
  
  Iframework.PortsOut = Backbone.Collection.extend({
    model: Iframework.PortOut
  });

});
