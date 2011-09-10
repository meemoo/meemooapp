$(function(){


var Node = Backbone.Model.extend({
  defaults: {
    src: "",
    x: 0,
    y: 0,
    w: 100,
    h: 100
  },
  initializeView: function () {
    return this.view = new NodeView({model:this});
  }
});

var Nodes = Backbone.Collection.extend({
  model: Node
});

var NodeView = Backbone.View.extend({
  tagName: "div",
  className: "node",
  template: _.template($('#node-template').html()),
  events: {
    "dragstop .module":   "move",
    "resizestop .module": "resize",
    "info .iframe":       "infoLoaded"
  },
  initialize: function () {
    this.render();
    this.$(".module")
      .mousedown( function () {
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
  },
  infoLoaded: function (event) {
    console.log(event);
  }
});

var Edge = Backbone.Model.extend({
  defaults: {
    from: null,
    to: null
  },
  initialize: function () {
    if (this.attributes.from) {
    }
  },
  initializeView: function () {
    return this.view = new EdgeView({model:this});
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
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },
});

window.Graph = Backbone.Model.extend({
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
      console.log(this.attributes.nodes.models);
    }
    if (this.attributes.edges) {
      this.attributes.edges = new Edges(this.attributes.edges);
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
  },
  addEdge: function (edge) {
    this.$(".edges").append( edge.initializeView().el );
  }
});


});