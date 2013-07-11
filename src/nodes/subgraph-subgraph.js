// extends src/nodes/graph.js which extends src/node-box-native-view.js

$(function(){

  var template = '<button class="open">view subgraph</button>';

  Iframework.NativeNodes["subgraph-subgraph"] = Iframework.NativeNodes["subgraph"].extend({

    info: {
      title: "subgraph",
      description: "encapsulate some nodes into a nested macro subgraph"
    },
    template: _.template(template),
    events: {
      "click .open": "openSubgraph"
    },
    initializeModule: function(){
      var graph = this.model.get("state").graph !== undefined ? this.model.get("state").graph : {"info":{"author":"meemoo","title":"subgraph","description":"Meemoo macro subgraph","parents":[],"url":""},"nodes":[{"id":0,"src":"meemoo:subgraph/input","x":103,"y":91,"w":80,"h":60,"state":{"label":"in"}},{"id":1,"src":"meemoo:subgraph/output","x":667,"y":486,"w":80,"h":60,"state":{"label":"out"}}],"edges":[]};
      graph.parentGraph = this.model.parentGraph;
      this.graph = new Iframework.Graph(graph);
      this.model.get("state").graph = this.graph;

      this.graph.initializeView();

      // Sync i/o ports
      this.graph.get("nodes").each(this.nodeAdded, this);
      this.graph.get("nodes").on("add", this.nodeAdded, this);
      this.graph.get("nodes").on("remove", this.nodeRemoved, this);
    },
    inputlabel: function (label) {
      this.model.view.$(".node-box-title-name").text( label );
    },
    nodeAdded: function (node) {
      // Check if i/o
      var port;
      if (node.get("src") === "meemoo:subgraph/input") {
        port = this.model.addInput({
          id: node.id,        
          name: (node.get("state").label ? node.get("state").label : "in")
        });
      } else if (node.get("src") === "meemoo:subgraph/output") {
        port = this.model.addOutput({
          id: node.id,
          name: (node.get("state").label ? node.get("state").label : "out")
        });
        // node.on("send:"+node.id, function(value){
        node.on("subgraphSend", function(value){
          this.send(node.id, value);
        }, this);
      }
      if (port) {
        // Listen for changes to label
        node.on("changelabel", function(label) {
          if (port.view) {
            port.view.$(".label").text(label);
          }
        }, this);
      }
    },
    nodeRemoved: function (node) {
      // Check if i/o
      var port;
      if (node.get("src") === "meemoo:subgraph/input") {
        port = this.model.Inputs.get(node.id);
      } else if (node.get("src") === "meemoo:subgraph/output") {
        port = this.model.Outputs.get(node.id);
      }
      if (port) {
        port.remove();
      }
    },
    openSubgraph: function () {
      Iframework.showGraph(this.graph);
    },
    renderAnimationFrame: function (timestamp) {
      if (this.graph && this.graph.view) {
        this.graph.view.renderAnimationFrame(timestamp);
      }
    },
    receive: function (name, value) {
      // HACK
      if (name === "label") {
        this.inputlabel(value);
        return;
      }
      // Forward to subgraph
      var fwd = this.graph.get("nodes").get(name);
      if (fwd && fwd.view) {
        fwd.view.Native.inputdata(value);
      }
    },
    remove: function () {
      this.graph.remove();
    },
    inputs: {
      label: {
        type: "string",
        "default": "subgraph"
      }
    },
    outputs: {
    }

  });


});
