$(function(){

  Iframework.NodeView = Backbone.View.extend({
    send: function(message) {
      this.model.send(message);
    },
    recieve: function(message) {
      this.model.recieve(message);
    }
  });

});
