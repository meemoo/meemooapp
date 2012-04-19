$(function(){

  var template = 
    '<div class="module" style="left:<%= get("x")-10 %>px;top:<%= get("y")-30 %>px;width:<%= get("w")+20 %>px;height:<%= get("h")+40 %>px;" >'+
      '<div class="ports ports-in"></div>'+
      '<div class="ports ports-out"></div>'+
      '<h1 class="title">...</h1>'+
      '<button type="button" class="showcontrols">show controls</button>'+
      '<div class="controls">'+
        '<button type="button" class="remove">remove</button>'+
        '<button type="button" class="refresh">refresh</button>'+
        '<button type="button" class="hidecontrols">hide controls</button>'+
      '</div>'+
      '<iframe class="frame" name="<%= frameIndex %>" src="<%= get("src") %>" style="width:<%= get("w") %>px;height:<%= get("h") %>px;"></iframe>'+
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
      "mousedown .module, .title": "mousedown",
      "click .module, .title": "click",
      "click .showcontrols": "showControls",
      "click .hidecontrols": "hideControls",
      "click .refresh":      "refresh",
      "click .remove":       "removeModel"
    },
    initialize: function () {
      this.render();
      this.$(".module")
        .draggable({ handle: "h1" })
        .resizable();
      this.$(".showcontrols")
        .button({ icons: { primary: "ui-icon-carat-1-w" }, text: false });
      this.$(".hidecontrols")
        .button({ icons: { primary: "ui-icon-carat-1-e" }, text: false });
      this.$(".refresh")
        .button({ icons: { primary: "ui-icon-arrowrefresh-1-s" }, text: false });
      this.$(".remove")
        .button({ icons: { primary: "ui-icon-trash" }, text: false });
    },
    render: function () {
      this.$el.html(this.template(this.model));
      return this;
    },
    infoLoaded: function (info) {
      this.$('h1')
        .text(this.model.get("id") + ": " + info.title)
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
    click: function (event) {
      // Don't fire click on graph
      event.stopPropagation();
    },
    addInput: function (port) {
      this.$(".ports-in").append( port.initializeView().el );
    },
    addOutput: function (port) {
      this.$(".ports-out").append( port.initializeView().el );
    },
    showControls: function () {
      this.$(".showcontrols").hide();
      this.$(".controls").show();
    },
    hideControls: function () {
      this.$(".showcontrols").show();
      this.$(".controls").hide();
    },
    refresh: function () {
      this.$(".frame")[0].src = this.model.get("src");
    },
    removeModel: function () {
      this.model.remove();
    },
    remove: function () {
      this.$el.remove();
    }

  });

});
