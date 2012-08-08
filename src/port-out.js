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
    },
    // Output ports send messages
    send: function (message) {
      this.Edges.each(function(edge){
        _.defer(function(){
          edge.Target.recieve(message);            
        });
      });
    }
  });
  
  Iframework.PortsOut = Backbone.Collection.extend({
    model: Iframework.PortOut
  });

});
