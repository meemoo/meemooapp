$(function(){

  var template = 
    '<div class="module" style="left:<%= x-10 %>px;top:<%= y-30 %>px;width:<%= w+20 %>px;height:<%= h+40 %>px;" >'+
      '<div class="ports ports-in"></div>'+
      '<div class="ports ports-out"></div>'+
      '<h1 class="title">...</h1>'+
      '<iframe class="frame" src="<%= src %>#nodeid=<%= id %>" style="width:<%= w %>px;height:<%= h %>px;"></iframe>'+
    '</div>';

  Iframework.NodeView = Backbone.View.extend({
    tagName: "div",
    className: "node",
    template: _.template(template),
    events: {
      "dragstart .module":   "dragstart",
      "drag .module":        "drag",
      "dragstop .module":    "dragstop",
      "resizestart .module": "resizestart",
      "resize .module":      "resize",
      "resizestop .module":  "resizestop",
      "mousedown .module, .title": "mousedown"
    },
    initialize: function () {
      this.render();
      this.$(".module")
        .draggable()
        .resizable();
    },
    render: function () {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    infoLoaded: function (info) {
      this.$('h1')
        .text(this.model.frameIndex + ": " + info.title)
        .attr({
          title: "by "+info.author+": "+info.description
        });
    },
    _relatedEdges: null,
    relatedEdges: function () {
      // i10n? Don't have to filter through all edges, just ones connected to this node
      // Resets to null on dis/connect
      if ( this._relatedEdges === null ) {
        this._relatedEdges = this.model.graph.get("edges").filter( function (edge) {
          return ( edge.get("source")[0] === this.model.get("id") || edge.get("target")[0] === this.model.get("id") );
        }, this);
      }
      return this._relatedEdges;
    },
    dragstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      Iframework.maskFrames();
    },
    drag: function (event, ui) {
      _.each(this.relatedEdges(), function(edge){
        if (edge.view) {
          edge.view.redraw();
        }
      });
    },
    dragstop: function (event, ui) {
      // Remove iframe masks
      Iframework.unmaskFrames();
      //HACK fix new edge setting module xy bug (makes dragging modules by ports not work)
      if ( !$(event.target).is(".module") ) { return; }
      // Redraw edges once more
      this.drag();
      // Save position to model
      this.model.set({
        x: ui.offset.left + 10,
        y: ui.offset.top + 30
      });
    },
    resizestart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      Iframework.maskFrames();
    },
    resize: function (event, ui) {
      // Rerender related edges
      this.drag();
    },
    resizestop: function (event, ui) {
      // Remove iframe masks
      Iframework.unmaskFrames();
      
      // Set model w/h
      var newW = ui.size.width;
      var newH = ui.size.height;
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
    mousedown: function (event, ui) {
      // Deactivate others
      $("div.module").removeClass("active");
      
      // Bring to top
      var topZ = 0;
      $("div.nodes div.module").each(function(){
        var thisZ = Number($(this).css("z-index"));
        if (thisZ > topZ) { 
          topZ = thisZ; 
        }
      });
      this.$(".module")
        .css("z-index", topZ+1)
        .addClass("active");
    },
    addInput: function (port) {
      this.$(".ports-in").append( port.initializeView().el );
    },
    addOutput: function (port) {
      this.$(".ports-out").append( port.initializeView().el );
    }

  });

});
