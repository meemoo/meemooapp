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
    "dragstop .module": "move"
  },
  initialize: function () {
    this.render();
    this.$(".module")
      .click( function () {
        $("div.module").removeClass("active");
        $(event.target).addClass("active");
        // Bring to top
        var topZ = 0;
        $("div.nodes div.module").each(function(){
          var thisZ = Number($(this).css("z-index"));
          if (thisZ > topZ) { topZ = thisZ; } 
        });
        $(this).css("z-index", topZ+1);
      }).draggable({
        helper: function(event){
          // Bring to top
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
        },
        // stop: function(event, ui){
        //   $(event.target).offset({
        //     left: $(ui.helper).offset().left, 
        //     top: $(ui.helper).offset().top
        //   });
        // }
      }).resizable({
        helper: "ui-resizable-helper"
      })//.disableSelection();
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
  }
});

var Edge = Backbone.Model.extend({
  defaults: {
    from: null,
    to: null
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