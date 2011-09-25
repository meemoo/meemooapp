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
    for (var i=0; i<this.model.graph.get("edges").length; i++){
      // i10n: only related
      if (this.model.graph.get("edges").at(i).view) this.model.graph.get("edges").at(i).view.render();
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
      // i10n: only related
      if (this.model.graph.get("edges").at(i).view) this.model.graph.get("edges").at(i).view.render();
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
    // var o = this.$('div.port-'+outin+' span.port.'+name).offset();
    // return (o ? o.left+7 : 0);
    return this.$('div.port-'+outin+' span.port.'+name).offset().left + 7;
  },
  portOffsetTop: function (outin, name) {
    // var o = this.$('div.port-'+outin+' span.port.'+name).offset();
    // return (o ? o.top+7 : 0);
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
    return this.view = new EdgeView({model:this});
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
  svgPath: function () {
    var fromX = this.model.source.view.portOffsetLeft('out', this.model.get("source")[1]);
    var fromY = this.model.source.view.portOffsetTop('out', this.model.get("source")[1]);
    var toX = this.model.target.view.portOffsetLeft('in', this.model.get("target")[1]);
    var toY = this.model.target.view.portOffsetTop('in', this.model.get("target")[1]);
    return "M "+ fromX +" "+ fromY 
      +" L "+ (fromX+15) +" "+ fromY 
      +" C "+ (fromX + 50) +" "+ fromY +" "+ (toX - 50) +" "+ toY +" "+ (toX-15) +" "+ toY 
      +" L "+ toX +" "+ toY;
  },
  svgPathShadow: function () {
    var fromX = this.model.source.view.portOffsetLeft('out', this.model.get("source")[1]);
    var fromY = this.model.source.view.portOffsetTop('out', this.model.get("source")[1]) + 1;
    var toX = this.model.target.view.portOffsetLeft('in', this.model.get("target")[1]);
    var toY = this.model.target.view.portOffsetTop('in', this.model.get("target")[1]) + 1;
    return "M "+ fromX +" "+ fromY 
      +" L "+ (fromX+15) +" "+ fromY 
      +" C "+ (fromX + 50) +" "+ fromY +" "+ (toX - 50) +" "+ toY +" "+ (toX-15) +" "+ toY 
      +" L "+ toX +" "+ toY;
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
    edges: new Edges(),
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
    if (this.view) this.view.addNode(node);
  },
  addEdge: function (edge) {
    this.get("edges").add(edge);
    if (this.view) this.view.addEdge(edge);
  },
  checkLoaded: function () {
    for (var i=0; i<this.get("nodes").length; i++) {
      if (this.get("nodes").at(i).loaded == false) return false;
    }
    this.loaded = true;
    
    // Connect edges when all modules have loaded (+.5 second)
    setTimeout(function(){
      MeemooApplication.shownGraph.connectEdges();
    }, 500);
    // this.connectEdges();
    
    return true;
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
    if (MeemooApplication.shownGraph) {
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
  }
};

// Listen for /info messages from nodes
window.addEventListener("message", MeemooApplication.gotMessage, false);

// Disable selection for better drag+drop
$('body').disableSelection();


});