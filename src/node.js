$(function(){

  Iframework.Node = Backbone.Model.extend({
    send: function (message) {
      // Send message out to connected nodes
    },
    recieve: function (message) {
      // Get message from another node
    }
  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
