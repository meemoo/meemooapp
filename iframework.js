$(function(){


var Node = Backbone.Model.extend({
  loaded: false,
  defaults: {
    src: "",
    x: 0,
    y: 0,
    w: 100,
    h: 100
  },
  initializeView: function () {
    return this.view = new NodeView({model:this});
  },
  send: function (message) {
    if (this.frameIndex != undefined) {
      window.frames[this.frameIndex].postMessage(message, "*");
    }
  },
  setState: function (state) {
    this.send("/setState/"+encodeURIComponent(JSON.stringify(state)));
  },
  infoLoaded: function (info) {
    this.view.infoLoaded(info);
    // Set state
    if (this.get("state")) {
      this.setState(this.get("state"));
    }
    this.loaded = true;
    // Check if all modules are loaded
    this.graph.checkLoaded();
  },
  addPort: function (info) {
    if (this.view) this.view.addPort(info);
  }
});

var Nodes = Backbone.Collection.extend({
  model: Node
});

var NodeView = Backbone.View.extend({
  tagName: "div",
  className: "node",
  template: _.template($('#node-template').html()),
  portInTemplate: _.template($('#port-in-template').html()),
  events: {
    "dragstop .module":   "move",
    "resizestop .module": "resize"
  },
  initialize: function () {
    this.render();
    this.$(".module")
      .mousedown( function (event) {
        $("div.module").removeClass("active");
        $(event.target).addClass("active");
        // Bring to top
        var topZ = 0;
        $("div.nodes div.module").each(function(){
          var thisZ = Number($(this).css("z-index"));
          if (thisZ > topZ) { topZ = thisZ; } 
        });
        $(this).css("z-index", topZ+1);
      })
      .click( function () {
      })
      .draggable({
        // handle: 'h1',
        helper: function(event){
          // Bring helper to top
          var topZ = 0;
          $("div.nodes div.module").each(function(){
            var thisZ = Number($(this).css("z-index"));
            if (thisZ > topZ) { topZ = thisZ; }
          });
          var helper = $("<div class='ui-draggable-helper'></div>")
            .width( $(this).width() )
            .height( $(this).height() )
            .css( "z-index", topZ+10 );
          return helper
        },
        start: function() {
          $(this).trigger("click");
        }
      })
      .resizable({
        helper: "ui-resizable-helper"
      })
      //.disableSelection();
  },
  render: function () {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },
  move: function (event, ui) {
    var newX = $(ui.helper).offset().left;
    var newY = $(ui.helper).offset().top;
    $(event.target).offset({
      left: newX, 
      top: newY
    });
    this.model.set({
      x: newX,
      y: newY
    });
    this.$(".input").attr({
      cx: newX - 4,
      cy: newY - 4
    });
    this.$(".output").attr({
      cx: newX + this.model.get("w") + 5,
      cy: newY + this.model.get("h") + 5
    });
    // Rerender related edges
    for (var i=0; i<this.model.graph.get("edges").length; i++){
      var thisEdge = this.model.graph.get("edges").at(i);
      if (this.model == thisEdge.from || this.model == thisEdge.to) {
        thisEdge.view.render();
      }
    }
  },
  resize: function (event, ui) {
    var newW = this.$(".module").width();
    var newH = this.$(".module").height();
    this.model.set({
      w: newW,
      h: newH
    });
    this.$(".output").attr({
      cx: this.model.get("x") + newW + 5,
      cy: this.model.get("y") + newH + 5
    });
    this.$(".frame").css({
      width: newW - 20,
      height: newH - 40
    });
    // Rerender related edges
    for (var i=0; i<this.model.graph.get("edges").length; i++){
      var thisEdge = this.model.graph.get("edges").at(i);
      if (this.model == thisEdge.from) {
        thisEdge.view.render();
      }
    }
  },
  infoLoaded: function (info) {
    this.$('h1')
      .text(info.title)
      .attr({
        title: "by "+info.author+": "+info.description
      });
  },
  addPort: function (info) {
    this.$(".ports-in").append(this.portInTemplate(info));
  }
});

var Edge = Backbone.Model.extend({
  defaults: {
    from: null,
    to: null
  },
  initialize: function () {
  },
  initializeView: function () {
    return this.view = new EdgeView({model:this});
  },
  connect: function () {
    if (this.from && this.from.loaded && this.to && this.to.frameIndex != undefined) {
      this.from.send("/connect/"+this.to.frameIndex);
    }
  }
});

var Edges = Backbone.Collection.extend({
  model: Edge
});

var EdgeView = Backbone.View.extend({
  tagName: "div", // Svg group
  className: "edge",
  template: _.template($('#edge-template').html()),
  initialize: function () {
    this.render();
  },
  render: function () {
    $(this.el).html(this.template(this.model));
    return this;
  }
});

var Graph = Backbone.Model.extend({
  loaded: false,
  defaults: {
    info: {
      author: "",
      title: "",
      description: "",
      parent: "",
      permalink: ""
    },
    nodes: new Nodes(),
    edges: new Edges()
  },
  initialize: function () {
    // Convert arrays into Backbone Collections
    if (this.attributes.nodes) {
      this.attributes.nodes = new Nodes(this.attributes.nodes);
      for(var i=0; i<this.attributes.nodes.models.length; i++) {
        this.attributes.nodes.models[i].graph = this; 
      }
    }
    if (this.attributes.edges) {
      this.attributes.edges = new Edges(this.attributes.edges);
      for(var i=0; i<this.get("edges").length; i++) {
        // Attach this graph to the edge
        var thisEdge = this.get("edges").at(i);
        thisEdge.graph = this;
        // Attach the node models to the edge
        for(var j=0; j<this.attributes.nodes.models.length; j++) {
          var thisNode = this.attributes.nodes.models[j];
          if (thisEdge.attributes.from == thisNode.attributes.id) {
            thisEdge.from = thisNode;
          }
          if (thisEdge.attributes.to == thisNode.attributes.id) {
            thisEdge.to = thisNode;
          }
        }
      }
    }
    this.view = new GraphView({model:this});
  },
  addNode: function (node) {
    this.attributes.nodes.add(node);
    if (this.view) this.view.addNode(node);
  },
  addEdge: function (edge) {
    this.attributes.edges.add(edge);
    if (this.view) this.view.addEdge(edge);
  },
  checkLoaded: function () {
    for (var i=0; i<this.get("nodes").length; i++) {
      if (this.get("nodes").at(i).loaded == false) return false;
    }
    this.loaded = true;
    this.connectEdges();
    return true;
  },
  connectEdges: function () {
    // Only when all modules have loaded
    if (this.loaded) {
      for(var i=0; i<this.get("edges").length; i++) {
        var thisEdge = this.get("edges").at(i);
        thisEdge.connect();
      }
    }
  }
});

var GraphView = Backbone.View.extend({
  tagName: "div",
  className: "graph",
  template: _.template($('#graph-template').html()),
  initialize: function () {
    this.render();
    $('body').append(this.el);
    
    this.model.attributes.nodes.each(this.addNode);
    this.model.attributes.edges.each(this.addEdge);
  },
  render: function () {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },
  addNode: function (node) {
    this.$(".nodes").append( node.initializeView().el );
    node.frameIndex = window.frames.length - 1;
  },
  addEdge: function (edge) {
    this.$(".edges").append( edge.initializeView().el );
  }
});

window.MeemooApplication = {
  shownGraph: undefined,
  showGraph: function (graph) {
    this.shownGraph = new Graph(graph);
  },
  gotInfo: function (e) {
    var message = e.data.split("/");
    var info;
    if ( message[2] ) {
      info = JSON.parse(decodeURIComponent(message[2]));
    } 
    if (!info) {
      return false;
    }
    for (var i=0; i<MeemooApplication.shownGraph.get("nodes").models.length; i++){
      var node = MeemooApplication.shownGraph.get("nodes").at(i);
      // Find the corresponding node and load the info
      if (e.source == node.view.$('.frame')[0].contentWindow) {
        switch (message[1]) {
          case "info":
            node.infoLoaded(info);
            break;
          case "addPort":
            node.addPort(info);
            break;
          defualt:
            break;
        }
      }
    }
  }
};

// Listen for /info messages from nodes
window.addEventListener("message", MeemooApplication.gotInfo, false);

// Disable selection for better drag+drop
$('body').disableSelection();


});