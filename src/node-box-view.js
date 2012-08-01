$(function(){

  var template = 
    '<div class="module" style="left:<%= get("x")-10 %>px;top:<%= get("y")-30 %>px;width:<%= get("w")+20 %>px;height:<%= get("h")+40 %>px;" >'+
      '<div class="ports ports-in"></div>'+
      '<div class="ports ports-out"></div>'+
      '<h1 class="title">...</h1>'+
      '<button type="button" class="showcontrols">show controls</button>'+
      '<div class="controls">'+
        '<button type="button" class="remove">remove</button>'+
        '<button type="button" class="hidecontrols">hide controls</button>'+
      '</div>'+
      '<div class="inner">'+
      '</div>'+
    '</div>';

  // var innerTemplate = '<div class="info" />';

  Iframework.NodeBoxView = Iframework.NodeView.extend({
    tagName: "div",
    className: "node",
    template: _.template(template),
    // innerTemplate: _.template(innerTemplate),
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
      "click .remove":       "removeModel"
    },
    initialize: function () {
      this.render();
      this.$(".module")
        .draggable({ handle: "h1" })
        .resizable({ minHeight: 100, minWidth: 100 });
      this.$(".showcontrols")
        .button({ icons: { primary: "icon-left-open" }, text: false });
      this.$(".hidecontrols")
        .button({ icons: { primary: "icon-right-open" }, text: false });
      this.$(".remove")
        .button({ icons: { primary: "icon-trash" }, text: false });

      // Disable selection for better drag+drop
      this.$("h1").disableSelection();

      // Bring newest to top
      this.mousedown();

    },
    initializeNative: function () {
      // Called from GraphView.addNode
      if (!this.Native) {
        this.Native = new Iframework.NativeNodes[this.model.lazyLoadType]({model:this.model});
        this.$(".inner").append( this.Native.initialize().$el );
      }

      // Check if all modules are loaded
      this.model.loaded = true;
      this.model.graph.checkLoaded();
    },
    render: function () {
      this.$el.html(this.template(this.model));
      return this;
    },
    infoLoaded: function (info) {
      this.$('h1')
        .text(this.model.get("id") + ": " + info.title)
        .attr({
          title: (info.author ? "by "+info.author+": " : "" ) + info.description
        });
    },
    _relatedEdges: null,
    relatedEdges: function () {
      // Resets to null on dis/connect
      if ( this._relatedEdges === null ) {
        this._relatedEdges = this.model.graph.get("edges").filter( function (edge) {
          return ( edge.get("source")[0] === this.model.get("id") || edge.get("target")[0] === this.model.get("id") );
        }, this);
      }
      return this._relatedEdges;
    },
    resetRelatedEdges: function () {
      this._relatedEdges = null;
      this.relatedEdges();
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
        x: ui.offset.left + 10 + $('.graph').scrollLeft(),
        y: ui.offset.top + 30 + $('.graph').scrollTop()
      });
      this.model.graph.view.resizeEdgeSVG();
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
      // this.$(".frame").css({
      //   width: newW - 20,
      //   height: newH - 40
      // });
      this.model.graph.view.resizeEdgeSVG();
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
    removeModel: function () {
      this.model.remove();
    },
    remove: function () {
      this.$el.remove();
    },
    refresh: function () {
      //
    }

  });

});
