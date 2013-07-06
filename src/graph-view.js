$(function(){

  var template = 
    '<div class="edges">'+
      '<svg class="edgesSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300"></svg>'+
    '</div>'+
    '<div class="nodes" />'+
    '<div class="iframework-graph-nav" style="display:none;">'+
      '<button class="show-parent-graph">back to parent graph</button>'+
    '</div>';

  Iframework.GraphView = Backbone.View.extend({
    tagName: "div",
    className: "graph",
    template: _.template(template),
    events: {
      "click":           "click",
      "dragenter":       "ignoreDrag",
      "dragover":        "ignoreDrag",
      "drop":            "drop",
      "selectablestart": "selectableStart",
      "selectablestop":  "selectableStop",
      "click .show-parent-graph": "showParentGraph"
    },
    unhidden: false,
    initialize: function () {
      this.render();
      if (this.model.isSubgraph) {
        this.$(".iframework-graph-nav").show();
        this.$el.hide();
      }
      Iframework.$el.prepend(this.el);

      this.edgesSvg = this.$('.edgesSvg')[0];

      // HACK Panel visible?
      if ( Iframework.$(".panel").is(":visible") ){
        this.$el.css("right", "350px");
      }

      this.model.get("nodes").each( this.addNode.bind(this) );

      // Drag helper from module library
      this.$el.droppable({ 
        accept: ".addnode, .canvas, .meemoo-plugin-images-thumbnail"
      });

      // Thanks Stu Cox http://stackoverflow.com/a/14578826/592125
      var supportsTouch = 'ontouchstart' in document;
      if (!supportsTouch) {
        // Selectable messes up scroll on touch devices
        this.$el.selectable({
          filter: ".module",
          delay: 20
        });
      }

      this.resizeEdgeSVG();

    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    renderAnimationFrame: function (timestamp) {
      // Hit all nodes
      this.model.get("nodes").each(function(node){
        if (node.view.Native) {
          node.view.Native.renderAnimationFrame(timestamp);
        }
      });
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
    ignoreDrag: function (event) {
      event.originalEvent.stopPropagation();
      event.originalEvent.preventDefault();
    },
    drop: function (event, ui) {
      this.ignoreDrag(event);

      // Drop files
      var dt = event.originalEvent.dataTransfer;
      if (dt) {
        var files = dt.files;
        if ( dt.files.length > 0 ) {
          var file = dt.files[0];
          var split = file.type.split("/");
          var o = {
            x: this.el.scrollLeft + event.originalEvent.clientX + 10,
            y: this.el.scrollTop + event.originalEvent.clientY + 35
          };
          if (split[0]==="image"){
            o.src = "meemoo:image/in";
            o.state = { url: window.URL.createObjectURL( file ) };
            Iframework.shownGraph.addNode( o );
          } else if (split[0]==="video"){
            o.src = "meemoo:video/player";
            o.state = { url: window.URL.createObjectURL( file ) };
            Iframework.shownGraph.addNode( o );
          } else if (split[0]==="text"){
            var reader = new FileReader();
            reader.onload = function(e) {
              o.src = "meemoo:ui/textarea";
              o.state = { value: e.target.result };
              Iframework.shownGraph.addNode( o );
            };
            reader.readAsText(file);
          }
        }
      }

      // Drop images or mods from libraries
      if (!ui) {return false;}

      var type = ui.helper.data("meemoo-drag-type");
      if (!type) {return false;}

      var options = {
        x: Math.round(this.el.scrollLeft + ui.offset.left + 10),
        y: Math.round(this.el.scrollTop + ui.offset.top + 35)
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
      if (node.lazyLoadType) {
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
      var width = rect.x + rect.width + 100;
      var height = rect.y + rect.height + 100;
      if (width === 100 && height === 100) {
        // So wires on new graph show up
        width = this.$el.width();
        height = this.$el.height();
      }
      // Only get bigger
      if (svg.getAttribute("width") < width) {
        svg.setAttribute("width", Math.round(width));
      }
      if (svg.getAttribute("height") < height) {
        svg.setAttribute("height", Math.round(height));
      }
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
        copied.nodes.push( JSON.parse(JSON.stringify(selected)) );
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
          copied.edges.push( JSON.parse(JSON.stringify(edge)) );
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
        this.$(".module").removeClass("ui-selected");
        for (var i=0; i<copied.nodes.length; i++) {
          var oldNode = JSON.parse(JSON.stringify( copied.nodes[i] ));
          // Offset pasted
          oldNode.x += 50;
          oldNode.y += 50;
          oldNode.parentGraph = this.model;
          var newNode = this.model.addNode(oldNode);
          newNode.copiedFrom = oldNode.id;
          newNodes.push(newNode);
          // Select pasted
          if (newNode.view) {
            newNode.view.select();
          }
        }
        // Add edges
        for (var j=0; j<copied.edges.length; j++) {
          var oldEdge = JSON.parse(JSON.stringify( copied.edges[j] ));
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
          newEdge.parentGraph = this.model;
          newEdge = new Iframework.Edge( newEdge );
          this.model.addEdge(newEdge);
        }
      }
    },
    maskFrames: function () {
      $(".iframe-type").append( '<div class="iframemask" />' );
    },
    unmaskFrames: function () {
      $(".iframemask").remove();
    },
    showParentGraph: function () {
      if (this.model.parentGraph) {
        Iframework.showGraph( this.model.parentGraph );
      }
    },
    rerenderEdges: function () {
      this.model.get("edges").each(function(edge){
        if (edge.view) {
          edge.view.redraw();
        }
      }, this);
    }
    
  });

});
