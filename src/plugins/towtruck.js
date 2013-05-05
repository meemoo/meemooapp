( function(Iframework) {

  var template = $(
    '<button onclick="TowTruck(this); return false;">Start TowTruck</button>' 
  );

  // Add menu
  Iframework.addMenuSection("Collaborate", template, "load");

  // Sync functions
  var sendGraphChange = function(graph){
    TowTruck.send({
      type: "iframework.graph.change", 
      graph: graph.toJSON()
    });
  };

  // Setup TowTruck
  window.TowTruckConfig_on_ready = function () {
    // Start by syncing the graph when somebody joins

    // Listen for changes to graph 
    // TODO make these much finer-grained for add/remove node/edge, move node, change state, click
    Iframework.on("change", sendGraphChange);
    TowTruck.hub.on("iframework.graph.change", function (msg) {
      var newGraph = msg.graph;
      alert(newGraph);
    });
  };
  window.TowTruckConfig_on_close = function () {
    Iframework.off("change", graphChanged);
  };

  // Load TowTruck
  yepnope({
    load: "https://towtruck.mozillalabs.com/towtruck.js"
  });

}(Iframework) );
