$(function(){

  Iframework.Node = Backbone.Model.extend({
    send: function (message) {
      // Send message out to connected nodes
    },
    receive: function (message) {
      // Get message from another node
    },
    //iframe only
    sendFromFrame: function(){},
    iframeLoaded: function(){}

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
