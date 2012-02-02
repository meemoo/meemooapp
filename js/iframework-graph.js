$(function(){

  Iframework.Graph = Backbone.Model.extend({
    loaded: false,
    defaults: {
      info: {
        author: "",
        title: "",
        description: "",
        parent: "",
        permalink: ""
      },
      nodes: [],
      edges: []
    },
    // events: {
    //   "change": "graphChanged"
    // },
    initialize: function () {
      // Convert arrays into Backbone Collections
      if (this.attributes.nodes) {
        var nodes = this.attributes.nodes;
        this.attributes.nodes = new Iframework.Nodes();
        for (var i=0; i<nodes.length; i++) {
          var node = new Iframework.Node(nodes[i]);
          node.graph = this;
          this.addNode(node);
        }
      }
      if (this.attributes.edges) {
        var edges = this.attributes.edges;
        this.attributes.edges = new Iframework.Edges();
        for (var j=0; j<edges.length; j++) {
          var edge = new Iframework.Edge(edges[j]);
          edge.graph = this;
          this.addEdge(edge);
        }
      }
      this.view = new Iframework.GraphView({model:this});

      // Change event
      this.on("change", this.graphChanged);
    },
    addNode: function (node) {
      var count = this.get("nodes").length;
      // Give id if not defined
      if (!node.get('id') || node.get('id') === "") {
        node.set({"id": count});
      }
      // Make sure node id is unique
      var isDupe = this.get("nodes").any(function(_node) {
        return _node.get('id') === node.get('id');
      });
      // Change id if duplicate
      while (isDupe) {
        count++;
        node.set({"id":count});
        isDupe = this.get("nodes").any(function(_node) {
          return _node.get('id') === node.get('id');
        });
      }

      this.get("nodes").add(node);
      node.graph = this;

      if (this.view) {
        this.view.addNode(node);
      }

      this.trigger("change");
    },
    removeNode: function (node) {

      this.trigger("change");
    },
    addEdge: function (edge) {
      // Make sure edge is unique
      var isDupe = this.get("edges").any(function(_edge) {
        return ( _edge.get('source')[0] === edge.get('source')[0] && _edge.get('source')[1] === edge.get('source')[1] && _edge.get('target')[0] === edge.get('target')[0] && _edge.get('target')[1] === edge.get('target')[1] );
      });
      if (isDupe) {
        console.warn("duplicate edge ignored");
        return false;
      } else {
        this.trigger("change");
        return this.get("edges").add(edge);
      }
    },
    removeEdge: function (edge) {
      edge.disconnect();
      if (this.view) {
        this.view.removeEdge(edge);
      }
      this.get("edges").remove(edge);

      this.trigger("change");
    },
    checkLoaded: function () {
      for (var i=0; i<this.get("nodes").length; i++) {
        if (this.get("nodes").at(i).loaded === false) { 
          return false; 
        }
      }
      this.loaded = true;
      
      // Disconnect then connect edges
      this.reconnectEdges();

      Iframework.addModulesToLibrary();
      
      return true;
    },
    reconnectEdges: function () {
      for(var i=0; i<this.get("edges").length; i++) {
        // Disconnect them first to be sure not doubled
        this.get("edges").at(i).disconnect();
      }
      // Connect edges when all modules have loaded (+.5 seconds)
      setTimeout(function(){
        Iframework.shownGraph.connectEdges();
      }, 500);
    },
    connectEdges: function () {
      for(var i=0; i<this.get("edges").length; i++) {
        this.get("edges").at(i).connect();
      }
    },
    graphChanged: function () {
      if (Iframework.$(".source").is(":visible")) {
        // HACK
        window.setTimeout(function(){
          Iframework.sourcerefresh();
        }, 100);
      }
    }
  });
  
  Iframework.Graphs = Backbone.Collection.extend({
    model: Iframework.Graph
  });

});
