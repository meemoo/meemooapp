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
      "selectablestop":  "selectableStop"
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
          accept: ".addnode" 
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
    click: function (event) {
      // Hide dis/connection boxes
      $(".edge-edit").remove();
      Iframework.selectedPort = null;
      
      // Unactivate modules
      $("div.module").removeClass("active");
    },
    drop: function (event, ui) {
      var module = ui.draggable.data("module");
      var x = Math.round(this.$el.scrollLeft() + ui.offset.left + 10);
      var y = Math.round(this.$el.scrollTop() + ui.offset.top + 35);
      module.view.dragAddNode({x:x,y:y});
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

      if (!!edge.Source.view) {
        edge.Source.view.resetRelatedEdges();
      }
      if (!!edge.Target.view) {
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
    resizeEdgeSVG: function () {
      var width = 0;
      var height = 0;
      this.model.get('nodes').each(function(node){
        var thisRight = node.get('x') + node.get('w');
        if ( thisRight > width ) {
          width = thisRight;
        }
        var thisBottom = node.get('y') + node.get('h');
        if ( thisBottom > height ) {
          height = thisBottom;
        }
      }, this);
      width += 150;
      height += 50;
      if (width === 150 && height === 50) {
        // So wires on new graph show up
        width = this.$el.width();
        height = this.$el.height();
      }
      this.$('#edgesSvg').css({
        "width": width,
        "height": height
      });
    },
    selectableStart: function () {
      // Add a mask so that iframes don't steal mouse
      this.maskFrames();
    },
    _selected: [],
    selectableStop: function (event) {
      if (event) {
        // Remove iframe masks
        this.unmaskFrames();
      }
      this._selected = [];
      var uiselected = $(".module.ui-selected");
      for (var i=0; i<uiselected.length; i++) {
        this._selected.push({
          el: uiselected[i],
          offset: $(uiselected[i]).offset(),
          view: $(uiselected[i]).data("view")
        });
      }
      Iframework._enableKeyBindings = true;
    },
    selectAll: function () {
      $(".module").addClass("ui-selected");
      this.selectableStop();
    },
    selectNone: function () {
      $(".module").removeClass("ui-selected");
      this.selectableStop();
    },
    cut: function(){
      this.copy();
      var i;
      for (i=0; i<Iframework._copied.nodes.length; i++) {
        // HACK offset cut for pasting in same spot
        Iframework._copied.nodes[i].x -= 50;
        Iframework._copied.nodes[i].y -= 50;
      }
      //Delete selected
      for (i=0; i<this._selected.length; i++) {
        this._selected[i].view.removeModel();
      }
      // Empty _selected
      this.selectableStop();
    },
    copy: function(){
      var copied = {nodes:[],edges:[]};
      for (var i=0; i<this._selected.length; i++) {
        // toJSON() saves it with its current state
        copied.nodes.push( this._selected[i].view.model.toJSON() );
      }
      // Copy common edges
      this.model.get("edges").each(function(edge){
        var sourceSelected, targetSelected = false;
        for (i=0; i<this._selected.length; i++) {
          if (edge.Source.node === this._selected[i].view.model) {
            sourceSelected = true;
          }
          if (edge.Target.node === this._selected[i].view.model) {
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
    // deleteSelected: function(){
    //   for (var i=0; i<this._selected.length; i++) {
    //     this._selected[i].view.removeModel();
    //   }
    //   // Empty _selected
    //   this.selectableStop();
    // },
    maskFrames: function () {
      $(".iframe-type").append( '<div class="iframemask" />' );
    },
    unmaskFrames: function () {
      $(".iframemask").remove();
    }
    
  });

});
