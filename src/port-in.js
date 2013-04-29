$(function(){

  Iframework.PortIn = Iframework.Port.extend({
    defaults: {
      name: "",
      type: "",
      description: "",
      "default": null
    },
    initializeView: function () {
      this.view = new Iframework.PortInView({model:this});
      return this.view;
    }
  });
  
  Iframework.PortsIn = Backbone.Collection.extend({
    model: Iframework.PortIn
  });

});
