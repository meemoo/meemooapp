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
  initialize: function () {
    this.inputs = {};
    this.outputs = {};
  },
  initializeView: function () {
    this.view = new NodeView({model:this});
    return this.view;
  },
  send: function (message) {
    if (this.frameIndex !== undefined) {
      window.frames[this.frameIndex].postMessage(message, "*");
    }
  },
  infoLoaded: function (info) {
    if (this.view) {
      this.view.infoLoaded(info);
    }
  },
  setState: function (state) {
    this.send({setState: state});
  },
  stateReady: function () {
    // Set state
    if (this.get("state")) {
      this.setState(this.get("state"));
    }
    this.loaded = true;
    // Check if all modules are loaded
    this.graph.checkLoaded();
  },
  addInput: function (info) {
    if (this.view && !this.inputs.hasOwnProperty(info.name)) { 
      this.inputs[info.name] = info;
      this.view.addInput(info); 
    }
  },
  addOutput: function (info) {
    if (this.view && !this.outputs.hasOwnProperty(info.name)) { 
      this.outputs[info.name] = info;
      this.view.addOutput(info); 
    }
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
    "dragstart .module":   "dragstart",
    "drag .module":        "drag",
    "dragstop .module":    "dragstop",
    "resizestart .module": "resizestart",
    "resizestop .module":  "resizestop"
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
      .draggable({
        handle: 'h1'
      })
      .resizable({
        helper: "ui-resizable-helper"
      });
  },
  render: function () {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },
  dragstart: function (event, ui) {
    // Add a mask so that iframes don't steal mouse
    window.MeemooApplication.maskFrames();
  },
  drag: function (event, ui) {
    for (var i=0; i<this.model.graph.get("edges").length; i++) {
      var edge = this.model.graph.get("edges").at(i);
      if (edge.view && (edge.get("source")[0] == this.model.get("id") || edge.get("target")[0] == this.model.get("id")) ) { 
        edge.view.redraw();
      }
    }
  },
  dragstop: function (event, ui) {
    // Remove iframe masks
    window.MeemooApplication.unmaskFrames();
    // Redraw edges once more
    this.drag();
    // Save position to model
    this.model.set({
      x: this.$(".module").offset().left + 10,
      y: this.$(".module").offset().top + 30
    });
  },
  resizestart: function (event, ui) {
    // Add a mask so that iframes don't steal mouse
    window.MeemooApplication.maskFrames();
  },
  resizestop: function (event, ui) {
    // Remove iframe masks
    window.MeemooApplication.unmaskFrames();
    
    var newW = this.$(".module").width();
    var newH = this.$(".module").height();
    this.model.set({
      w: newW - 20,
      h: newH - 40
    });
    this.$(".frame").css({
      width: newW - 20,
      height: newH - 40
    });
    // Rerender related edges
    for (var i=0; i<this.model.graph.get("edges").length; i++){
      var edge = this.model.graph.get("edges").at(i);
      if (edge.view && edge.get("source")[0] == this.model.get("id")) { 
        edge.view.redraw(); 
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
    source: [0, "default"], 
    target: [0, "default"]
  },
  initialize: function () {
    this.set({color: MeemooApplication.getWireColor()});
  },
  initializeView: function () {
    this.view = new EdgeView({model:this});
    return this.view;
  },
  connect: function () {
    // IDs from the graph
    for (var i=0; i<this.graph.get("nodes").length; i++) {
      if (this.graph.get("nodes").at(i).get("id") === this.get("source")[0]) {
        this.source = this.graph.get("nodes").at(i);
      }
      if (this.graph.get("nodes").at(i).get("id") === this.get("target")[0]) {
        this.target = this.graph.get("nodes").at(i);
      }
    }
    this.source.send({
      connect: { 
        source: this.get("source"),
        target: [this.target.frameIndex, this.get("target")[1]]
      }
    });
    if (this.graph.view) {
      this.graph.view.addEdge(this);
    }
  },
  disconnect: function () {
    if (this.source && this.target) {
      this.source.send({
        disconnect: { 
          source: this.get("source"),
          target: [this.target.frameIndex, this.get("target")[1]]
        }
      });
      if (this.graph.view) {
        this.graph.view.removeEdge(this);
      }
    }
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
    // Don't use .toJSON() because using .source and .target Node
    $(this.el).html(this.template(this));
    // port insides
    this.model.source.view.$("div.port-out span.port."+this.model.get("source")[1]).css("background-color", this.model.get("color"));
    this.model.target.view.$("div.port-in span.port."+this.model.get("target")[1]).css("background-color", this.model.get("color"));
    return this;
  },
  redraw: function () {
    this.$("svg").css({ 
      "left": this.svgX(), 
      "top": this.svgY(),
      "width": this.svgW(),
      "height": this.svgH()
    });
    this.$("svg path.wire").attr("d", this.svgPath() );
    this.$("svg path.wire-shadow").attr("d", this.svgPathShadow() );
  },
  svgW: function () {
    var fromX = this.model.source.view.portOffsetLeft('out', this.model.get("source")[1]);
    var toX = this.model.target.view.portOffsetLeft('in', this.model.get("target")[1]);
    return Math.abs(toX-fromX) + 100;
  },
  svgH: function () {
    var fromY = this.model.source.view.portOffsetTop('out', this.model.get("source")[1]);
    var toY = this.model.target.view.portOffsetTop('in', this.model.get("target")[1]);
    return Math.abs(toY-fromY) + 50;
  },
  svgX: function () {
    var fromX = this.model.source.view.portOffsetLeft('out', this.model.get("source")[1]);
    var toX = this.model.target.view.portOffsetLeft('in', this.model.get("target")[1]);
    return Math.min(toX, fromX) - 50;
  },
  svgY: function () {
    var fromY = this.model.source.view.portOffsetTop('out', this.model.get("source")[1]);
    var toY = this.model.target.view.portOffsetTop('in', this.model.get("target")[1]);
    return Math.min(toY, fromY) - 25;
  },
  svgPath: function () {
    var fromX = this.model.source.view.portOffsetLeft('out', this.model.get("source")[1]) - this.svgX();
    var fromY = this.model.source.view.portOffsetTop('out', this.model.get("source")[1]) - this.svgY();
    var toX = this.model.target.view.portOffsetLeft('in', this.model.get("target")[1]) - this.svgX();
    var toY = this.model.target.view.portOffsetTop('in', this.model.get("target")[1]) - this.svgY();
    return "M "+ fromX +" "+ fromY +
      " L "+ (fromX+15) +" "+ fromY +
      " C "+ (fromX+50) +" "+ fromY +" "+ (toX-50) +" "+ toY +" "+ (toX-15) +" "+ toY +
      " L "+ toX +" "+ toY;
  },
  svgPathShadow: function () {
    // Same as svgPath() but y+1
    var fromX = this.model.source.view.portOffsetLeft('out', this.model.get("source")[1]) - this.svgX();
    var fromY = this.model.source.view.portOffsetTop('out', this.model.get("source")[1]) - this.svgY() + 1;
    var toX = this.model.target.view.portOffsetLeft('in', this.model.get("target")[1]) - this.svgX();
    var toY = this.model.target.view.portOffsetTop('in', this.model.get("target")[1]) - this.svgY() + 1;
    return "M "+ fromX +" "+ fromY +
      " L "+ (fromX+15) +" "+ fromY +
      " C "+ (fromX+50) +" "+ fromY +" "+ (toX-50) +" "+ toY +" "+ (toX-15) +" "+ toY +
      " L "+ toX +" "+ toY;
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
      for(var i=0; i<this.get("nodes").length; i++) {
        this.get("nodes").at(i).graph = this; 
      }
    }
    if (this.attributes.edges) {
      this.attributes.edges = new Edges(this.attributes.edges);
      for(var i=0; i<this.get("edges").length; i++) {
        this.get("edges").at(i).graph = this; 
      }
    }
    this.view = new GraphView({model:this});
  },
  addNode: function (node) {
    this.get("nodes").add(node);
    if (this.view) { this.view.addNode(node); }
  },
  addEdge: function (edge) {
    this.get("edges").add(edge);
    if (this.view) { this.view.addEdge(edge); }
  },
  checkLoaded: function () {
    for (var i=0; i<this.get("nodes").length; i++) {
      if (this.get("nodes").at(i).loaded === false) { return false; }
    }
    this.loaded = true;
    
    // Disconnect then connect edges
    this.reconnectEdges();
    
    return true;
  },
  reconnectEdges: function () {
    for(var i=0; i<this.get("edges").length; i++) {
      // Disconnect them first to be sure not doubled
      this.get("edges").at(i).disconnect();
    }
    // Connect edges when all modules have loaded (+.5 seconds)
    setTimeout(function(){
      MeemooApplication.shownGraph.connectEdges();
    }, 500);
  },
  connectEdges: function () {
    for(var i=0; i<this.get("edges").length; i++) {
      this.get("edges").at(i).connect();
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
    
    this.model.get("nodes").each(this.addNode);
    // this.model.get("edges").each(this.addEdge);
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
  },
  removeEdge: function (edge) {
    $(edge.view.el).remove();
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
    if (MeemooApplication.shownGraph) {
      for (var i=0; i<MeemooApplication.shownGraph.get("nodes").models.length; i++){
        var node = MeemooApplication.shownGraph.get("nodes").at(i);
        // Find the corresponding node and load the info
        if (node.get("id") == e.data.nodeid) {
          for (var name in e.data) {
            var info = e.data[name];
            switch (name) {
              case "info":
                node.infoLoaded(info);
                break;
              case "addInput":
                node.addInput(info);
                break;
              case "addOutput":
                node.addOutput(info);
                break;
              case "stateReady":
                node.stateReady();
                break;
              defualt:
                break;
            }
          }
        }
      }
    }
  },
  maskFrames: function () {
    $(".module").each(function(){
      $(this).append(
        $('<div class="iframemask" />').css({
          "width": $(this).children(".frame").width()+2,
          "height": $(this).children(".frame").height()+2
        })
      );
    });
  },
  unmaskFrames: function () {
    $(".iframemask").remove();
  }
};

// Listen for /info messages from nodes
window.addEventListener("message", MeemooApplication.gotMessage, false);

// Disable selection for better drag+drop
$('body').disableSelection();

});