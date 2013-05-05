$(function(){

  var template = 
    '<div class="edges">'+
      '<svg id="edgesSvg" class="edgesSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>'+
    '</div>'+
    '<div class="nodes" />';

  Iframework.GraphView = Backbone.View.extend({
    tagName: "div",
    className: "graph",
    template: _.template(template),
    events: {
      "click": "click",
      "drop":  "drop",
      "selectablestart": "selectableStart",
      "selectablestop":  "selectableStop",
      "touchstart":  "touch",
      "touchmove":   "touch",
      "touchend":    "touch"
    },
    initialize: function () {
      this.render();
      Iframework.$el.prepend(this.el);

      // HACK Panel visible?
      if ( Iframework.$(".panel").is(":visible") ){
        this.$el.css("right", "350px");
      }

      this.model.get("nodes").each(this.addNode);

      // Drag helper from module library
      this.$el
        .droppable({ 
          accept: ".addnode, .canvas, .meemoo-plugin-images-thumbnail"
        })
        .selectable({
          filter: ".module",
          // distance: 1,
          delay: 20
        });

      this.resizeEdgeSVG();

      // requestAnimationFrame on all nodes
      window.requestAnimationFrame(this.renderAnimationFrame);
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    renderAnimationFrame: function (timestamp) {
      // Safari doesn't pass timestamp
      timestamp = timestamp !== undefined ? timestamp : Date.now();
      var self = Iframework.shownGraph.view;
      if (!!self) {
        window.requestAnimationFrame(self.renderAnimationFrame);
        self.model.get("nodes").each(function(node){
          if (node.view.Native) {
            node.view.Native.renderAnimationFrame(timestamp);
          }
        });
      }
    },
    touch: function (event) {
      // Don't touchpunch selectable (it messes up scrolling)
      event.stopPropagation();
    },
    click: function (event) {
      // Hide dis/connection boxes
      $(".edge-edit").remove();
      Iframework.selectedPort = null;
      
      // Deactivate modules
      this.$(".module").removeClass("active");
      // Deselect modules
      this.$(".module").removeClass("ui-selected");
    },
    drop: function (event, ui) {
      var type = ui.helper.data("meemoo-drag-type");
      if (!type) {return false;}

      var options = {
        x: Math.round(this.$el.scrollLeft() + ui.offset.left + 10),
        y: Math.round(this.$el.scrollTop() + ui.offset.top + 35)
      };

      switch(type){
        case "library-module":
          var module = ui.draggable.data("module");
          if (module) {
            // Add module
            module.view.dragAddNode( options );
          }
          break;
        case "canvas":
          var canvas = ui.helper.data("meemoo-drag-canvas");
          // Copy canvas
          if (canvas) {
            options.src = "meemoo:image/in";
            options.canvas = canvas;
            var url = ui.helper.data("meemoo-image-url");
            if (url && url.slice(0,4)==="http") {
              // Dragged from public image library
              options.state = {};
              options.state.url = url;
            }
            Iframework.shownGraph.addNode( options );
          }
          break;
        default:
          break;
      }
      return false;
    },
    addNode: function (node) {
      this.$(".nodes").append( node.initializeView().el );
      // Render the native view
      if (!!node.lazyLoadType) {
        node.view.initializeNative();
      }
    },
    addEdge: function (edge) {
      edge.initializeView();

      if (edge.Source.view) {
        edge.Source.view.resetRelatedEdges();
      }
      if (edge.Target.view) {
        edge.Target.view.resetRelatedEdges();
      }
    },
    remove: function(){
      this.$el.remove();
    },
    removeNode: function (node) {
      if (node.view) {
        node.view.remove();
      }
    },
    removeEdge: function (edge) {
      if (edge.Source && edge.Source.view) {
        edge.Source.view.resetRelatedEdges();
      }
      if (edge.Target && edge.Target.view) {
        edge.Target.view.resetRelatedEdges();
      }
      if (edge.view) {
        edge.view.remove();
      }
    },
    resizeEdgeSVG: _.debounce( function () {
      // _.debounce keeps it from getting called more than needed
      var svg = this.$('.edgesSvg')[0];
      var rect = svg.getBBox();
      var width = rect.x+rect.width;
      var height = rect.y+rect.height;
      if (width === 0 && height === 0) {
        // So wires on new graph show up
        width = this.$el.width();
        height = this.$el.height();
      }
      svg.setAttribute("width", Math.round(width+50));
      svg.setAttribute("height", Math.round(height+50));
    }, 100),
    selectableStart: function () {
      // Add a mask so that iframes don't steal mouse
      this.maskFrames();
    },
    selectableStop: function (event) {
      // Remove iframe masks
      this.unmaskFrames();
    },
    selectAll: function () {
      this.$(".module").addClass("ui-selected");
    },
    selectNone: function () {
      this.$(".module").removeClass("ui-selected");
    },
    cut: function(){
      // Copy selected
      this.copy();
      var i;
      for (i=0; i<Iframework._copied.nodes.length; i++) {
        // HACK offset cut for pasting in same spot
        Iframework._copied.nodes[i].x -= 50;
        Iframework._copied.nodes[i].y -= 50;
      }
      // Delete selected
      var uiselected = this.$(".module.ui-selected");
      for (i=0; i<uiselected.length; i++) {
        $(uiselected[i]).data("iframework-node-view").removeModel();
      }
    },
    copy: function(){
      var copied = {nodes:[],edges:[]};
      var uiselected = this.$(".module.ui-selected");
      var i, selected;

      // Copy selected nodes
      for (i=0; i<uiselected.length; i++) {
        selected = $(uiselected[i]).data("iframework-node-view").model;
        var nodeJSON = selected.toJSON();
        copied.nodes.push( JSON.parse(JSON.stringify(nodeJSON)) );
      }

      // Copy common edges
      this.model.get("edges").each(function(edge){
        var sourceSelected, targetSelected = false;
        for (i=0; i<uiselected.length; i++) {
          selected = $(uiselected[i]).data("iframework-node-view").model;
          if (edge.Source.node === selected) {
            sourceSelected = true;
          }
          if (edge.Target.node === selected) {
            targetSelected = true;
          }
        }
        if (sourceSelected && targetSelected) {
          copied.edges.push( edge.toJSON() );
        }
      }, this);
      // Save these to Iframework so can paste to other graphs
      Iframework._copied = copied;
    },
    paste: function(){
      var copied = Iframework._copied;
      if (copied && copied.nodes.length > 0) {
        var newNodes = [];
        // Select none
        $(".module").removeClass("ui-selected");
        for (var i=0; i<copied.nodes.length; i++) {
          var oldNode = copied.nodes[i];
          // Offset pasted
          oldNode.x += 50;
          oldNode.y += 50;
          var newNode = this.model.addNode(oldNode);
          newNode.copiedFrom = oldNode.id;
          newNodes.push(newNode);
          // Select pasted
          if (newNode.view) {
            newNode.view.select();
          }
        }
        // Set new selection
        this.selectableStop();
        // Add edges
        for (var j=0; j<copied.edges.length; j++) {
          var oldEdge = copied.edges[j];
          var newEdge = {source:[],target:[]};
          for (var k=0; k<newNodes.length; k++) {
            var node = newNodes[k];
            if (oldEdge.source[0] === node.copiedFrom) {
              newEdge.source[0] = node.id;
            }
            if (oldEdge.target[0] === node.copiedFrom) {
              newEdge.target[0] = node.id;
            }
          }
          newEdge.source[1] = oldEdge.source[1];
          newEdge.target[1] = oldEdge.target[1];
          newEdge = new Iframework.Edge( newEdge );
          newEdge.graph = this.model;
          this.model.addEdge(newEdge);
        }
      }
    },
    maskFrames: function () {
      $(".iframe-type").append( '<div class="iframemask" />' );
    },
    unmaskFrames: function () {
      $(".iframemask").remove();
    }
    
  });

});
