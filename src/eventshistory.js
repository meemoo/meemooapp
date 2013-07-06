$(function(){
  
  Iframework.Event = Backbone.Model.extend({
    defaults: function () {
      return {
        action: "",
        args: {}
      };
    },
    initialize: function () {
    }
  });

  Iframework.EventsHistory = Backbone.Collection.extend({
    model: Iframework.Event
  });
  
  // binding undo to ctrl+z
  Mousetrap.bind(['command+z', 'ctrl+z'], function(e) {
    // TODO work with subgraph
    // actual graph shown by iframework
    var graph = window.Iframework.shownGraph;
    // get the last event (stack top)
    var event = graph.eventsHistory.last();

    // what kind of action ocurred?
    if (event.get("action") === "removeNode") {
      var node = event.get("args").node;
      // make sure the node will use the same id
      var originalIndex = graph.usedIds.indexOf(node.get("id"));
      graph.usedIds.splice(originalIndex, 1);
      // add the node again
      graph.addNode(node);
      // add input and output ports
      var i;
      for (i=0; i<node.Inputs.length; i++) {
        node.view.addInput(node.Inputs.at(i));
      }
      for (i=0; i<node.Outputs.length; i++) {
        node.view.addOutput(node.Outputs.at(i));
      }
      // add edges
      var edges = event.get("args").edges;
      for (i=0; i<edges.length; i++) {
        graph.addEdge(edges[i]);
      }
    }
    // updates the events stack
    graph.eventsHistory.pop();
  });

});