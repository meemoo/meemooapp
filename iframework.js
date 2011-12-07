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
    // this.bind('change:x', this.positionChanged, this);
    // this.bind('change:y', this.positionChanged, this);
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
  },
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
  edgeEditTemplate: _.template($('#edge-edit-template').html()),
  events: {
    "dragstart .module":   "dragstart",
    "drag .module":        "drag",
    "dragstop .module":    "dragstop",
    "resizestart .module": "resizestart",
    "resizestop .module":  "resizestop",
    "click .hole":         "holeclick",
    "click .disconnect":   "disconnect"
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
  _relatedEdges: null,
  relatedEdges: function () {
    // i10n? Don't have to filter through all edges, just ones connected to this node
    // Resets to null on dis/connect
    if ( this._relatedEdges === null ) {
      this._relatedEdges = this.model.graph.get("edges").filter( function (edge) {
        return ( edge.get("source")[0] == this.model.get("id") || edge.get("target")[0] == this.model.get("id") );
      }, this);
    }
    return this._relatedEdges;
  },
  dragstart: function (event, ui) {
    // Add a mask so that iframes don't steal mouse
    window.MeemooApplication.maskFrames();
  },
  drag: function (event, ui) {
    _.each(this.relatedEdges(), function(edge){
      edge.view.redraw();
    });
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
    
    // Set model w/h
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
    this.drag();
  },
  infoLoaded: function (info) {
    this.$('h1')
      .text(info.title)
      .attr({
        title: "by "+info.author+": "+info.description
      });
  },
  addInput: function (info) {
    var newIn = this.portInTemplate(info);
    this.$("div.ports-in").append(newIn);
    // Drag from hole
    this.$("div.ports-in span.hole-"+info.name).data({
      nodeId: this.model.get("id"),
      portName: info.name
    }).draggable({
      helper: function (e) {
        var helper = $('<span class="holehelper holehelper-in" />');
        return helper;
      },
      start: function (event, ui) {
        // All outs
        $("div.ports-out span.hole").addClass("highlight");
        
        // Edge preview
        var edgePreview = new EdgeView();
        window.MeemooApplication.edgePreview = edgePreview;
        window.MeemooApplication.shownGraph.view.$(".edges").append( edgePreview.el );
      },
      drag: function (event, ui) {
        // Edge preview
        var positions = {
          fromX: event.pageX,
          fromY: event.pageY,
          toX: $(this).offset().left + 7,
          toY: $(this).offset().top + 7
        }
        window.MeemooApplication.edgePreview.setPositions(positions);
        window.MeemooApplication.edgePreview.redraw();
      },
      stop: function (event, ui) {
        $("div.ports-out span.hole").removeClass("highlight");
        
        // Edge preview
        window.MeemooApplication.shownGraph.view.$(".edges").children(".preview").remove();
        window.MeemooApplication.edgePreview = undefined;
      }
    });
    // Drag to port
    this.$("div.ports-in div.port-"+info.name).droppable({
      // Make new edge
      accept: ".hole-out",
      hoverClass: "drophover",
      drop: function(event, ui) {
        var source = ui.draggable;
        var target = $(this).children(".hole");
        var edge = new Edge({
          source: [source.data().nodeId, source.data().portName],
          target: [target.data().nodeId, target.data().portName]
        });
        edge.graph = window.MeemooApplication.shownGraph;
        if (edge.graph.addEdge(edge)){
          edge.connect();
        }
      }
    });
  },
  addOutput: function (info) {
    var el = this.portOutTemplate(info);
    this.$(".ports-out").append(el);
    // Drag from hole
    this.$("div.ports-out span.hole-"+info.name).data({
      nodeId: this.model.get("id"),
      portName: info.name
    }).draggable({
      helper: function (e) {
        var helper = $('<span class="holehelper holehelper-out" />');
        return helper;
      },
      start: function (event, ui) {
        // All ins
        $("div.ports-in span.hole").addClass("highlight");
        
        // Edge preview
        var edgePreview = new EdgeView();
        window.MeemooApplication.edgePreview = edgePreview;
        window.MeemooApplication.shownGraph.view.$(".edges").append( edgePreview.el );
      },
      drag: function (event, ui) {
        // Edge preview
        var positions = {
          fromX: $(this).offset().left + 7,
          fromY: $(this).offset().top + 7,
          toX: event.pageX,
          toY: event.pageY
        }
        window.MeemooApplication.edgePreview.setPositions(positions);
        window.MeemooApplication.edgePreview.redraw();
      },
      stop: function (event, ui) {
        $("div.ports-in span.hole").removeClass("highlight");
        
        // Edge preview
        window.MeemooApplication.shownGraph.view.$(".edges").children(".preview").remove();
        window.MeemooApplication.edgePreview = undefined;
      }
    });
    // Drag to port
    this.$("div.ports-out div.port-"+info.name).droppable({
      accept: ".hole-in",
      hoverClass: "drophover",
      drop: function(event, ui) {
        var source = $(this).children(".hole");
        var target = ui.draggable;
        var edge = new Edge({
          source: [source.data().nodeId, source.data().portName],
          target: [target.data().nodeId, target.data().portName]
        });
        edge.graph = window.MeemooApplication.shownGraph;
        if (edge.graph.addEdge(edge)){
          edge.connect();
        }
      }
    });
  },
  holeclick: function (event) {
    // Hide previous connected edges editor
    $('div.edge-edit').remove();
    
    // Show connected edges editor
    var isIn = $(event.target).hasClass("hole-in");
    var portName = $(event.target).data("portName");
    
    // Look at all node ports
    // this.model.graph.get("nodes").each( function(node){
    //   if (isIn) {
    //     console.log(node.outputs);
    //   } else {
    //     console.log(node.inputs);
    //   }
    // });
    
    //HACK
    this._relatedEdges = null;
    var connectedEdges = _.filter(this.relatedEdges(), function (edge) {
      return ( (isIn && portName === edge.get("target")[1]) || (!isIn && portName === edge.get("source")[1]) );
    });
    
    if (connectedEdges.length > 0) {
      var popupEl = $('<div class="edge-edit" />').css({
        left: event.pageX, 
        top: event.pageY
      });
      _.each(connectedEdges, function (edge) {
        var edgeEditEl = this.edgeEditTemplate(edge.view);
        popupEl.append(edgeEditEl);
      }, this);
      $(this.el).append(popupEl);
      $(".disconnect").button({
        icons: {
          primary: "ui-icon-scissors"
        },
        text: false
      });
    }
  },
  disconnect: function (event) {
    //HACK
    var edge = this.model.graph.get("edges").getByCid( $(event.target).parents(".edge-edit-item").attr("id") );
    if (edge) {
      this.model.graph.removeEdge(edge);
    }
    $('div.edge-edit').remove();
  },
  portOffsetLeft: function (outin, name) {
    return this.$('div.port-'+outin+' span.hole-'+name).offset().left + 7;
  },
  portOffsetTop: function (outin, name) {
    return this.$('div.port-'+outin+' span.hole-'+name).offset().top + 7;
  }
});

var Edge = Backbone.Model.extend({
  defaults: {
    source: [0, "default"], 
    target: [0, "default"]
  },
  initialize: function () {
  },
  initializeView: function () {
    if (!this.get("color")) {
      this.set({color: window.MeemooApplication.getWireColor()});
    }
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
    if (this.source.view) {
      this.source.view._relatedEdges = null;
    }
    if (this.target.view) {
      this.target.view._relatedEdges = null;
    }
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
  positions: {},
  initialize: function () {
    this.render();
  },
  render: function () {
    this.calcPositions();
    // Don't use .toJSON() because using .source and .target Node
    $(this.el).html(this.template(this));
    if (this.model) {
      // Port insides
      // this.model.source.view.$("div.port-out span.hole-"+this.model.get("source")[1]).css("background-color", this.model.get("color"));
      // this.model.target.view.$("div.port-in span.hole-"+this.model.get("target")[1]).css("background-color", this.model.get("color"));
    } else {
      // While dragging to connect
      $(this.el).addClass("preview");
    }
    return this;
  },
  redraw: function () {
    this.calcPositions();
    this.$("svg").css({
      "left": this.svgX(),
      "top": this.svgY(),
      "width": this.svgW(),
      "height": this.svgH()
    });
    this.$("svg path.wire").attr("d", this.svgPath() );
    this.$("svg path.wire-shadow").attr("d", this.svgPathShadow() );
  },
  setPositions: function (_positions) {
    this.positions = _positions;
  },
  calcPositions: function () {
    if (this.model) {
      // Connected edge
      var sourceName = this.model.get("source")[1];
      var targetName = this.model.get("target")[1];
      this.positions.fromX = this.model.source.view.portOffsetLeft('out', sourceName);
      this.positions.fromY = this.model.source.view.portOffsetTop('out', sourceName);
      this.positions.toX = this.model.target.view.portOffsetLeft('in', targetName);
      this.positions.toY = this.model.target.view.portOffsetTop('in', targetName);
    } else {
      // Mouse dragging preview edge, not connected
    }
  },
  svgX: function () {
    return Math.min(this.positions.toX, this.positions.fromX) - 50;
  },
  svgY: function () {
    return Math.min(this.positions.toY, this.positions.fromY) - 25;
  },
  svgW: function () {
    return Math.abs(this.positions.toX - this.positions.fromX) + 100;
  },
  svgH: function () {
    return Math.abs(this.positions.toY - this.positions.fromY) + 50;
  },
  svgPath: function () {
    var fromX = this.positions.fromX - this.svgX();
    var fromY = this.positions.fromY - this.svgY();
    var toX = this.positions.toX - this.svgX();
    var toY = this.positions.toY - this.svgY();
    return "M "+ fromX +" "+ fromY +
      " L "+ (fromX+15) +" "+ fromY +
      " C "+ (fromX+50) +" "+ fromY +" "+ (toX-50) +" "+ toY +" "+ (toX-15) +" "+ toY +
      " L "+ toX +" "+ toY;
  },
  svgPathShadow: function () {
    // Same as svgPath() but y+1
    var fromX = this.positions.fromX - this.svgX();
    var fromY = this.positions.fromY - this.svgY() + 1;
    var toX = this.positions.toX - this.svgX();
    var toY = this.positions.toY - this.svgY() + 1;
    return "M "+ fromX +" "+ fromY +
      " L "+ (fromX+15) +" "+ fromY +
      " C "+ (fromX+50) +" "+ fromY +" "+ (toX-50) +" "+ toY +" "+ (toX-15) +" "+ toY +
      " L "+ toX +" "+ toY;
  },
  color: function () {
    if (this.model) {
      // Connected
      return this.model.get('color');
    } else {
      // Preview
      return window.MeemooApplication.wireColors[window.MeemooApplication.wireColorIndex];
    }
  },
  label: function () {
    return this.model.get("source")[0] +":"+ this.model.get("source")[1] + 
      ' <span class="wiresymbol" style="color:' + this.color() + '">&mdash;</span> ' + 
      this.model.get("target")[0] +":"+ this.model.get("target")[1];
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
      var nodes = this.attributes.nodes;
      this.attributes.nodes = new Nodes();
      for (var i=0; i<nodes.length; i++) {
        var node = new Node(nodes[i]);
        node.graph = this;
        this.addNode(node);
      }
    }
    if (this.attributes.edges) {
      var edges = this.attributes.edges;
      this.attributes.edges = new Edges();
      for (var i=0; i<edges.length; i++) {
        var edge = new Edge(edges[i]);
        edge.graph = this;
        this.addEdge(edge);
      }
    }
    this.view = new GraphView({model:this});
  },
  addNode: function (node) {
    // Make sure node id is unique
    var isDupe = this.get("nodes").any(function(_node) {
      return _node.get('id') === node.get('id');
    });
    if (isDupe) {
      console.warn("duplicate node id ignored", node);
      return false;
    } else {
      return this.get("nodes").add(node);
    }
  },
  addEdge: function (edge) {
    // Make sure edge is unique
    var isDupe = this.get("edges").any(function(_edge) {
      return _edge.get('source')[0] === edge.get('source')[0] && _edge.get('source')[1] === edge.get('source')[1] && _edge.get('target')[0] === edge.get('target')[0] && _edge.get('target')[1] === edge.get('target')[1];
    });
    if (isDupe) {
      console.warn("duplicate edge ignored", edge);
      return false;
    } else {
      return this.get("edges").add(edge);
    }
  },
  removeEdge: function (edge) {
    edge.disconnect();
    if (this.view) {
      this.view.removeEdge(edge);
    }
    this.get("edges").remove(edge);
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

var Graphs = Backbone.Collection.extend({
  model: Graph
});

var GraphView = Backbone.View.extend({
  tagName: "div",
  className: "app",
  template: _.template($('#graph-template').html()),
  events: {
    "click .graph":     "click",
    "dragstart .graph": "dragstart",
    "drag .graph":      "drag",
    "dragstop .graph":  "dragstop"
  },
  initialize: function () {
    this.render();
    $('body').append(this.el);
    
    this.model.get("nodes").each(this.addNode);
    // this.model.get("edges").each(this.addEdge);
    
    // Panel buttons
    this.$(".panel .close, .panel .code").hide();
    this.$(".panel .close").button({
      icons: {
        primary: 'ui-icon-close'
      }
    }).click( function(){
      $(".panel .close, .panel .code").hide();
      $(".panel .source").show();
    });
    this.$(".panel .source").button({
      icons: {
        primary: 'ui-icon-gear'
      }
    }).click( function(){
      $(".panel .source").hide();
      $(".panel .close, .panel .code").show();
      $(".panel .code textarea").text( JSON.stringify(MeemooApplication.shownGraph, null, 2) );
    });
    
    // Drag graph
    this.$(".graph").draggable();
  },
  click: function (event) {
    if (!$(event.target).hasClass("hole")) {
      // Hide dis/connection boxes
      $(".edge-edit").remove();
    }
  },
  dragstart: function (event) {
  },
  drag: function (event) {},
  dragstop: function (event) {
    if ($(event.target).hasClass("graph")) {
      var delta = $(event.target).position();
      
      // Move nodes
      this.model.get("nodes").each( function (node) {
        var pos = node.view.$(".module").position();
        node.view.$(".module").css({
          "left": pos.left + delta.left,
          "top": pos.top + delta.top
        });
      });
      
      // Bump graph back
      this.$(".graph").css({top:0,left:0});
      
      // Sets node model x y and redraw edges
      this.model.get("nodes").each( function (node) {
        node.view.dragstop();
      });
    }
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
    if (this.wireColorIndex > this.wireColors.length-1) {
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
window.addEventListener("message", window.MeemooApplication.gotMessage, false);

// Disable selection for better drag+drop
$('body').disableSelection();

});