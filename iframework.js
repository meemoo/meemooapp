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
  initializeEdges: function () {
    if (this.attributes.edges) {
      this.attributes.edges = new Edges(this.attributes.edges);
      for(var i=0; i<this.get("edges").length; i++) {
        var thisEdge = this.get("edges").at(i);
        // Attach this graph to the edge
        thisEdge.graph = this.graph;
        // Attach the node models to the edge
        thisEdge.from = this;
        for(var j=0; j<this.graph.get("nodes").length; j++) {
          var thisNode = this.graph.get("nodes").at(j);
          if (thisEdge.attributes.node == thisNode.attributes.id) {
            thisEdge.to = thisNode;
          }
        }
      }
    } else {
      this.set({edges: new Edges()});
    }
  },
  // addEdge: function (edge) {
  //   this.attributes.edges.add(edge);
  //   if (this.view) this.view.addEdge(edge);
  // },
  // Called after all nodes are loaded
  connectEdges: function () {
    for(var i=0; i<this.get("edges").length; i++) {
      this.get("edges").at(i).connect();
    }
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
  addInput: function (info) {
    if (this.view) this.view.addInput(info);
  },
  addOutput: function (info) {
    if (this.view) this.view.addOutput(info);
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
  portOutTemplate: _.template($('#port-out-template').html()),
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
        handle: 'h1',
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
    for (var i=0; i<this.model.graph.get("nodes").length; i++){
      var thisNode = this.model.graph.get("nodes").at(i);
      for (var j=0; j<thisNode.get("edges").length; j++) {
        // i10n: only related
        thisNode.get("edges").at(j).view.render();
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
    for (var i=0; i<this.model.get("edges").length; i++){
      this.model.get("edges").at(i).view.render();
    }
  },
  infoLoaded: function (info) {
    this.$('h1')
      .text(info.title)
      .attr({
        title: "by "+info.author+": "+info.description
      });
  },
  addInput: function (info) {
    this.$(".ports-in").append(this.portInTemplate(info));
  },
  addOutput: function (info) {
    this.$(".ports-out").append(this.portOutTemplate(info));
  },
  portOffsetLeft: function (outin, name) {
    return this.$('div.port-'+outin+' span.port.'+name).offset().left + 7;
  },
  portOffsetTop: function (outin, name) {
    return this.$('div.port-'+outin+' span.port.'+name).offset().top + 7;
  }
});

var Edge = Backbone.Model.extend({
  defaults: {
    portout: "default",
    node: null,
    portin: "default"
  },
  initialize: function () {
    this.set({color: MeemooApplication.getWireColor()});
  },
  initializeView: function () {
    return this.view = new EdgeView({model:this});
  },
  connect: function () {
    if (this.from && this.from.loaded && this.to && this.to.frameIndex != undefined) {
      this.from.send({
        connect: {
          portout: this.get("portout"),
          node: this.to.frameIndex,
          portin: this.get("portin")
        }
      });
      if (this.graph.view) {
        this.graph.view.addEdge(this);
      }
    }
  },
  svgPath: function () {
    var fromX = this.from.view.portOffsetLeft('out', this.attributes.portout);
    var fromY = this.from.view.portOffsetTop('out', this.attributes.portout);
    var toX = this.to.view.portOffsetLeft('in', this.attributes.portin);
    var toY = this.to.view.portOffsetTop('in', this.attributes.portin);
    return "M "+ fromX +" "+ fromY +" C "+ (fromX + 80) +" "+ fromY +" "+ (toX - 80) +" "+ toY +" "+ toX +" "+ toY;
  }
});

var Edges = Backbone.Collection.extend({
  model: Edge
});

var EdgeView = Backbone.View.extend({
  tagName: "div",
  className: "edge",
  template: _.template($('#edge-template').html()),
  initialize: function () {
    this.render();
  },
  render: function () {
    // Don't use .toJSON() because using .from and .to Node
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
    nodes: new Nodes()
  },
  initialize: function () {
    // Convert arrays into Backbone Collections
    if (this.attributes.nodes) {
      this.attributes.nodes = new Nodes(this.attributes.nodes);
      for(var i=0; i<this.attributes.nodes.models.length; i++) {
        this.attributes.nodes.models[i].graph = this; 
        this.attributes.nodes.at(i).initializeEdges();
      }
    }
    this.view = new GraphView({model:this});
  },
  addNode: function (node) {
    this.attributes.nodes.add(node);
    if (this.view) this.view.addNode(node);
  },
  checkLoaded: function () {
    for (var i=0; i<this.get("nodes").length; i++) {
      if (this.get("nodes").at(i).loaded == false) return false;
    }
    this.loaded = true;
    
    // Connect edges when all modules have loaded (+.5 second)
    setTimeout(function () {
      for(var i=0; i<window.MeemooApplication.shownGraph.get("nodes").length; i++) {
        window.MeemooApplication.shownGraph.get("nodes").at(i).connectEdges();
      }
    }, 500);
    
    return true;
  },
  // connectEdges: function () {
  //   for(var i=0; i<this.get("nodes").length; i++) {
  //     this.get("nodes").at(i).connectEdges();
  //   }
  // }
});

var GraphView = Backbone.View.extend({
  tagName: "div",
  className: "graph",
  template: _.template($('#graph-template').html()),
  initialize: function () {
    this.render();
    $('body').append(this.el);
    
    this.model.attributes.nodes.each(this.addNode);
    // this.model.attributes.edges.each(this.addEdge);
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
  // Color scheme CC-BY-NC-SA from Skyblue2u http://www.colourlovers.com/palette/758853/A_Glass_Rainbow
  // wireColors: ["#97080E", "#DA4B0F", "#E9B104", "#488C13", "#1B55C0"],
  // Color scheme CC-BY-NC-SA from Skyblue2u http://www.colourlovers.com/palette/462628/Blazin_Jell-O_Rainbo
  wireColors: ["#DF151A", "#FD8603", "#F4F328", "#00DA3C", "#00CBE7"],
  wireColorIndex: 0,
  getWireColor: function () {
    var color = this.wireColors[this.wireColorIndex];
    this.wireColorIndex++;
    if (this.wireColorIndex > this.wireColors.length) {
      this.wireColorIndex = 0;
    }
    return color;
  },
  showGraph: function (graph) {
    this.shownGraph = new Graph(graph);
  },
  gotMessage: function (e) {
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
          case "addInput":
            node.addInput(info);
            break;
          case "addOutput":
            node.addOutput(info);
            break;
          defualt:
            break;
        }
      }
    }
  }
};

// Listen for /info messages from nodes
window.addEventListener("message", MeemooApplication.gotMessage, false);

// Disable selection for better drag+drop
$('body').disableSelection();


});