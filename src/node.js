$(function(){

  Iframework.Node = Backbone.Model.extend();
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
