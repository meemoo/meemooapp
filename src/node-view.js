$(function(){

  Iframework.NodeView = Backbone.View.extend({
    send: function(message) {
      this.model.send(message);
    },
    receive: function(message) {
      this.model.receive(message);
    }
  });

});
