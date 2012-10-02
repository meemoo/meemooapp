$(function(){

  var template = 
    '<div class="module" style="left:<%= get("x")-10 %>px;top:<%= get("y")-30 %>px;width:<%= get("w")+20 %>px;height:<%= get("h")+40 %>px;" >'+
      '<div class="outer"></div>'+
      '<div class="ports ports-in"></div>'+
      '<div class="ports ports-out"></div>'+
      '<h1 class="title">...</h1>'+
      '<button type="button" class="showcontrols">show controls</button>'+
      '<div class="controls">'+
        '<button type="button" class="remove">remove</button>'+
        '<button type="button" class="hidecontrols">hide controls</button>'+
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
        .data({view: this})
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
      if (!this.Native){
        if (Iframework.NativeNodes.hasOwnProperty(this.model.lazyLoadType)) {
          this.Native = new Iframework.NativeNodes[this.model.lazyLoadType]({model:this.model});
          this.$(".inner").append( this.Native.$el );
          // Check if all modules are loaded
          this.model.loaded = true;
          this.model.graph.checkLoaded();
        } else {
          console.warn("No native node found.");
        }
      }
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
        var edges = [];
        this.model.Inputs.each(function(port){
          port.Edges.each(function(edge){
            edges.push(edge);
          });
        });
        this.model.Outputs.each(function(port){
          port.Edges.each(function(edge){
            edges.push(edge);
          });
        });
        this._relatedEdges = edges;
      }
      return this._relatedEdges;
    },
    resetRelatedEdges: function () {
      this._relatedEdges = null;
      this.relatedEdges();
    },
    _delta: {},
    dragstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.graph.view.maskFrames();
      
      // Start dragging a deselected module
      if (!this.$(".module").hasClass("ui-selected")) {
        // Deselect others and select this one
        $("div.module.ui-selected").removeClass("ui-selected");
        this.$(".module").addClass("ui-selected");
      }

      // Reset offsets of selected
      this.model.graph.view.selectableStop();

      this._delta = this.$(".module").offset();
    },
    drag: function (event, ui) {
      _.each(this.relatedEdges(), function(edge){
        if (edge.view) {
          edge.view.redraw();
        }
      });

      if (event && ui) {
        // Drag is coming from this module
        // Move other modules
        var others = this.model.graph.view._selected;
        var deltaL = this._delta.left - ui.offset.left - $('.graph').scrollLeft();
        var deltaT = this._delta.top - ui.offset.top - $('.graph').scrollTop();
        for (var i=0; i<others.length; i++) {
          if (this.$(".module")[0] !== others[i].el) {
            // Move other selected module
            $(others[i].el).css({
              left: (others[i].offset.left - deltaL) + "px",
              top: (others[i].offset.top - deltaT) + "px"
            });
            // Redraw edges
            others[i].view.drag();
          }
        }
      }
    },
    dragstop: function (event, ui) {
      // Redraw edges once more
      this.drag();
      // Save position to model
      this.model.set({
        x: this.$(".module").offset().left + 10 + $('.graph').scrollLeft(),
        y: this.$(".module").offset().top + 30 + $('.graph').scrollTop()
      });
      if (event) {
        // Remove iframe masks
        this.model.graph.view.unmaskFrames();
        // Set other modules
        var others = this.model.graph.view._selected;
        for (var i=0; i<others.length; i++) {
          if (this.$(".module")[0] !== others[i].el) {
            // Call this dragstop on the other modules
            others[i].view.dragstop();
          }
        }
        // Resize edges container
        this.model.graph.view.resizeEdgeSVG();
      }
    },
    resizestart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.graph.view.maskFrames();
    },
    resize: function (event, ui) {
      // Rerender related edges
      this.drag();
    },
    resizestop: function (event, ui) {
      // Remove iframe masks
      this.model.graph.view.unmaskFrames();
      
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
      if (this.Native) {
        this.Native.resize(newW,newH);
      }
      this.model.graph.view.resizeEdgeSVG();
      // Rerender related edges
      this.drag();
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
      // With help from idFlood http://stackoverflow.com/a/8643716/592125
      if (event.ctrlKey || event.metaKey) {
        // Command key is pressed, toggle selection
        if (this.$(".module").hasClass("ui-selected")) {
          this.$(".module").removeClass("ui-selected");
        }
        else {
          this.select();
        }
      } else {
        // Command key isn't pressed, deselect others and select this one
        $("div.module.ui-selected").removeClass("ui-selected");
        this.select();
      }
      
      // Rebuild selected on graph view
      if (this.model.graph.view) {
        this.model.graph.view.selectableStop();
      }

      // Don't fire click on graph
      event.stopPropagation();
    },
    select: function () {
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
    }//,
    // selected: function(){
    //   console.log("sel", this.model);
    // },
    // unselected: function(){
    //   console.log("unsel", this.model);
    // }

  });

});
