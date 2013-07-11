$(function(){

  var template = 
    '<div class="module" style="left:<%= get("x")-10 %>px;top:<%= get("y")-30 %>px;width:<%= get("w")+20 %>px;height:<%= get("h")+40 %>px;" >'+
      '<div class="outer"></div>'+
      '<div class="ports ports-in"></div>'+
      '<div class="ports ports-out"></div>'+
      '<h1 class="title">'+
        '<span class="module-icon module-icon-small"></span>'+
        '<span class="node-box-title-name">...</span>'+
      '</h1>'+
      '<button title="show controls" type="button" class="showcontrols icon-left-open"></button>'+
      '<div class="controls">'+
        '<button title="remove module" type="button" class="remove icon-trash"></button>'+
        '<a title="view source" type="button" class="viewsource button icon-cog"></a>'+
        '<button title="hide controls" type="button" class="hidecontrols icon-right-open"></button>'+
      '</div>'+
      '<div class="inner"></div>'+
    '</div>';

  // var innerTemplate = '<div class="info" />';

  Iframework.NodeBoxView = Iframework.NodeView.extend({
    tagName: "div",
    className: "node",
    template: _.template(template),
    // innerTemplate: _.template(innerTemplate),
    events: {
      "dragstart .module":   "dragStart",
      "drag .module":        "drag",
      "dragstop .module":    "dragStop",
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
        .data({"iframework-node-view": this})
        .draggable({ 
          handle: "h1",
          helper: function(event) {
            var node = $(this);
            return $('<div class="ui-draggable-helper" style="width:'+node.width()+'px; height:'+node.height()+'px">');
          }
        })
        .resizable({ 
          minHeight: 100, 
          minWidth: 100, 
          helper: "ui-draggable-helper"
        });

      // View source button
      if (this.model.lazyLoadType) {
        this.$(".viewsource").attr({
          "href": "src/nodes/"+this.model.lazyLoadType+".js",
          "target": "_blank"
        });
      } else {
        this.$(".viewsource").hide();
      }

      // Disable selection for better drag+drop
      this.$("h1").disableSelection();

      // Bring newest to top
      this.mousedown();

    },
    initializeNative: function () {
      // Called from GraphView.addNode
      if (!this.Native){
        if (Iframework.NativeNodes.hasOwnProperty(this.model.lazyLoadType)) {
          this.Native = new Iframework.NativeNodes[this.model.lazyLoadType]({model:this.model});
          this.$(".inner").append( this.Native.$el );
          // Check if all modules are loaded
          this.model.loaded = true;
          this.model.parentGraph.checkLoaded();
        } else {
          // console.warn("No native node found.");
        }
      }
    },
    render: function () {
      this.$el.html(this.template(this.model));
      return this;
    },
    infoLoaded: function (info) {
      this.$('h1')
        .attr("title", this.model.get("id") + ": " + (info.author ? "by "+info.author+": " : "" ) + info.description);
      this.$('.node-box-title-name')
        .text(info.title);

      if (this.model.lazyLoadType) {
        this.$(".module-icon").addClass("module-icon-"+this.model.lazyLoadType);
      }
    },
    _alsoDrag: [],
    _dragDelta: {},
    dragStart: function(event, ui){
      if (event.target !== this.$(".module")[0]) { return; }

      // Add a mask so that iframes don't steal mouse
      this.model.parentGraph.view.maskFrames();

      // Select
      if (!this.$(".module").hasClass("ui-selected")){
        this.click(event);
      }

      // Make helper and save start position of all other selected
      var self = this;
      this._alsoDrag = [];
      this.model.parentGraph.view.$(".ui-selected").each(function() {
        if (self.$(".module")[0] !== this) {
          var el = $(this);
          var position = {
            left: parseInt( el.css('left'), 10 ), 
            top: parseInt( el.css('top'), 10 )
          };
          el.data("ui-draggable-alsodrag-initial", position);
          // Add helper
          var helper = $('<div class="ui-draggable-helper">').css({
            width: el.width(),
            height: el.height(),
            left: position.left,
            top: position.top
          });
          el.parent().append(helper);
          el.data("ui-draggable-alsodrag-helper", helper);
          // Add to array
          self._alsoDrag.push(el);
        }
      });
    },
    drag: function(event, ui){
      if (event.target !== this.$(".module")[0]) { return; }

      // Drag other helpers
      if (this._alsoDrag.length) {
        var self = $(event.target).data("ui-draggable");
        var op = self.originalPosition;
        var delta = {
          top: (self.position.top - op.top) || 0, 
          left: (self.position.left - op.left) || 0
        };

        _.each(this._alsoDrag, function(el){
          var initial = el.data("ui-draggable-alsodrag-initial");
          var helper = el.data("ui-draggable-alsodrag-helper");
          helper.css({
            left: initial.left + delta.left,
            top: initial.top + delta.top
          });
        });
      }
    },
    dragStop: function(event, ui){
      if (event.target !== this.$(".module")[0]) { return; }

      var x = parseInt(ui.position.left, 10);
      var y = parseInt(ui.position.top, 10);
      this.moveToPosition(x,y);
      // Also drag
      if (this._alsoDrag.length) {
        _.each(this._alsoDrag, function(el){
          var initial = el.data("ui-draggable-alsodrag-initial");
          var helper = el.data("ui-draggable-alsodrag-helper");
          var node = el.data("iframework-node-view");
          // Move other node
          node.moveToPosition(parseInt(helper.css("left"), 10), parseInt(helper.css("top"), 10));
          // Remove helper
          helper.remove();
          el.data("ui-draggable-alsodrag-initial", null);
          el.data("ui-draggable-alsodrag-helper", null);
        });
        this._alsoDrag = [];
      }

      // Remove iframe masks
      this.model.parentGraph.view.unmaskFrames();
    },
    moveToPosition: function(x, y){
      this.$(".module").css({
        left: x,
        top: y
      });
      this.model.set({
        x: x + 10,
        y: y + 30
      });
    },
    resizestart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.parentGraph.view.maskFrames();
    },
    resize: function (event, ui) {
    },
    resizestop: function (event, ui) {
      // Remove iframe masks
      this.model.parentGraph.view.unmaskFrames();
      
      // Set model w/h
      var newW = ui.size.width;
      var newH = ui.size.height;
      this.model.set({
        w: newW - 20,
        h: newH - 40
      });
      if (this.Native) {
        this.Native.resize(newW,newH);
      }
      this.model.parentGraph.view.resizeEdgeSVG();
    },
    mousedown: function (event, ui) {
      // Bring to top
      var topZ = 0;
      $("div.module").each(function(){
        var thisZ = Number($(this).css("z-index"));
        if (thisZ > topZ) { 
          topZ = thisZ; 
        }
      });
      this.$(".module")
        .css("z-index", topZ+1);

      if (event) {
        // Don't select
        event.stopPropagation();
      }

    },
    click: function (event) {
      // Select
      if (event.ctrlKey || event.metaKey) {
        // Command key is pressed, toggle selection
        this.$(".module").toggleClass("ui-selected");
      } else {
        // Command key isn't pressed, deselect others and select this one
        this.model.parentGraph.view.$(".ui-selected").removeClass("ui-selected");
        this.$(".module").addClass("ui-selected");
      }

      // Don't fire click on graph
      event.stopPropagation();
    },
    select: function (event) {
      // Called from code
      this.$(".module").addClass("ui-selected");
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
      this.model.remove(true);
    },
    remove: function () {
      // Called from GraphView.removeNode
      if (this.Native) {
        this.Native.remove();
      }
      this.$el.remove();
    },
    refresh: function () {
    },
    popout: function () {
    }

  });

});
