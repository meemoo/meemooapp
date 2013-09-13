$(function(){

  var portInTemplate = 
    '<div class="portshown portshown-in">'+
      '<span class="hole hole-in hole-<%= type_class %> icon-login"></span>'+
      '<span class="label"><%= name %></span>'+
    '</div>'+
    '<span class="plugend plugend-in plugend-<%= type_class %>"></span>';

  Iframework.PortInView = Iframework.PortView.extend({
    tagName: "div",
    className: "port",
    portInTemplate: _.template(portInTemplate),
    events: {
      "mousedown":                   "highlightEdge",
      "click .hole":                 "clickhole",
      "dragstart .hole":             "dragstart",
      "drag .hole, .holehelper":     "drag",
      "dragstop .hole, .holehelper": "dragstop",
      "dragstart .plugend":          "unplugstart",
      "drag .plugend":               "unplugdrag",
      "dragstop .plugend":           "unplugstop",
      "drop":                        "drop",
      "click .disconnect":           "disconnect",
      "submit .manualinput":         "manualinput",
      "click .publish-port":         "publishPort"
    },
    render: function () {
      this.$el.html( this.portInTemplate(this.model.toJSON()) );
      this.$el.addClass("port-in");
      this.$(".hole")
        .draggable({
          helper: function (e) {
            return $('<span class="holehelper holehelper-out" />');
          }
        });
      this.$(".plugend")
        .draggable({
          helper: function (e) {
            return $('<span class="plugendhelper plugendhelper-in" />');
          }
        });

      // Drag from hole
      this.$(".hole")
        .data({
          model: this.model
        });
        
      // The whole port is droppable
      var accept = "";
      var type = this.model.get("type_class");
      if (type === "all" || type === "bang"){
        // Anything can hit an in bang
        accept = ".hole-out, .plugend-in";
      } else {
        accept = ".hole-out.hole-all, .hole-out.hole-"+type+", .plugend-in.plugend-all, .plugend-in.plugend-"+type;
      }
      if (type === "string"){
        // HACK to allow int and float -> string
        accept += ", .hole-out.hole-int, .hole-out.hole-float, .plugend-in.plugend-int, .plugend-in.plugend-float";
      }
      if (type === "int" || type === "float" || type === "number") {
        // HACK to allow all int float number to connect
        accept += ", .hole-out.hole-int, .hole-out.hole-float, .hole-out.hole-number, .plugend-in.plugend-int, .plugend-in.plugend-float, .plugend-in.plugend-number";
      }
      this.$el.droppable({
        "hoverClass": "drophover",
        "accept": accept
      });

      this.$(".plugend").hide();

      // Disable selection for better drag+drop
      this.$(".portshown").disableSelection();
      
    },
    dragstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.node.parentGraph.view.maskFrames();
      
      // Highlight matching ins or outs
      $("div.ports-"+(this.model.isIn ? "out" : "in")+" span.hole")
        .addClass('fade');
      $("div.ports-"+(this.model.isIn ? "out" : "in")+" span.hole-" + this.model.get('type_class'))
        .addClass('highlight');
      
      // Edge preview
      var edgePreview = new Iframework.EdgeView();
      Iframework.edgePreview = edgePreview;
      this.drag(event, ui);
      this.$('.plugend').show();

      // Don't drag module
      event.stopPropagation();
    },
    drag: function (event, ui) {
      if (Iframework.edgePreview) {
        var dragX = ui.offset.left + Iframework.shownGraph.view.el.scrollLeft;
        var dragY = ui.offset.top + 8 + Iframework.shownGraph.view.el.scrollTop;
        var thisX = this.portOffsetLeft();
        var thisY = this.portOffsetTop();
        
        // Edge preview
        var positions = {
          fromX: (this.model.isIn ? dragX-2 : thisX),
          fromY: (this.model.isIn ? dragY : thisY),
          toX: (this.model.isIn ? thisX : dragX+20),
          toY: (this.model.isIn ? thisY : dragY)
        };
        Iframework.edgePreview.setPositions(positions);
        Iframework.edgePreview.redraw();
      }
      // Don't drag module
      event.stopPropagation();
    },
    dragstop: function (event, ui) {
      // Remove iframe masks
      this.model.node.parentGraph.view.unmaskFrames();

      $(".hole").removeClass("fade highlight");
      
      // Edge preview
      Iframework.edgePreview.remove();
      Iframework.edgePreview = undefined;
      if (this.relatedEdges().length < 1){
        this.$('.plugend').hide();
      }

      // Don't drag module
      event.stopPropagation();
    },
    drop: function (event, ui) {
      // HACK will drop always fire before dragstop?
      if (this.armDelete) {
        // Don't disconnect or reconnect wire dragged back to same port
        this.armDelete = false;
      } else {
        // Connect wire
        var from = $(ui.draggable).data("model");
        var to = this.model;
        var source = (this.model.isIn ? from : to);
        var target = (this.model.isIn ? to : from);
        var edge = new Iframework.Edge({
          source: [source.node.id, source.id],
          target: [target.node.id, target.id],
          parentGraph: this.model.parentNode.parentGraph
        });
        if (Iframework.edgePreview) {
          edge._color = Iframework.edgePreview._color;
        }
        if (edge.parentGraph.addEdge(edge)){
          edge.connect();
        }
      }
      // Don't bubble
      event.stopPropagation();
    },
    unpluggingEdge: null,
    armDeleteTimeout: null,
    armDelete: false,
    topConnectedEdge: function () {
      var topConnected;
      var topZ = 0;
      _.each(this.relatedEdges(), function(edge){
        if (edge.view._z >= topZ) {
          topZ = edge.view._z;
          topConnected = edge;
        }
      }, this);
      return topConnected;
    },
    unplugstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      this.model.node.parentGraph.view.maskFrames();

      // Find top connected wire
      var lastConnected = this.topConnectedEdge();
      if (!lastConnected) { return false; }

      this.unpluggingEdge = lastConnected;
      this.unpluggingEdge.view.dim();
      if (this.relatedEdges().length===1) {
        this.$(".plugend").hide();
      }

      var thatPort = this.model.isIn ? this.unpluggingEdge.Source : this.unpluggingEdge.Target;
      this.$(".plugend").data("model", thatPort);
      
      // Highlight related ins or outs
      $("div.ports-"+(this.model.isIn ? "in" : "out")+" span.hole-" + this.model.get('type_class'))
        .addClass('highlight');
      
      // Edge preview
      var edgePreview = new Iframework.EdgeView();
      edgePreview.setColor(this.unpluggingEdge.view._color);
      Iframework.edgePreview = edgePreview;

      this.armDelete = true;

      // Don't drag module
      event.stopPropagation();
    },
    unplugdrag: function (event, ui) {
      if (Iframework.edgePreview && this.unpluggingEdge) {
        var dragX = ui.offset.left + Iframework.shownGraph.view.el.scrollLeft;
        var dragY = ui.offset.top + 6 + Iframework.shownGraph.view.el.scrollTop;
        var thatPortView = this.model.isIn ? this.unpluggingEdge.Source.view : this.unpluggingEdge.Target.view;
        var thatX = thatPortView.portOffsetLeft();
        var thatY = thatPortView.portOffsetTop();
        
        // Edge preview
        var positions = {
          fromX: (this.model.isIn ? thatX : dragX-2),
          fromY: (this.model.isIn ? thatY : dragY),
          toX: (this.model.isIn ? dragX+20 : thatX),
          toY: (this.model.isIn ? dragY : thatY)
        };
        Iframework.edgePreview.setPositions(positions);
        Iframework.edgePreview.redraw();
      }
      // Don't drag module
      event.stopPropagation();
    },
    unplugstop: function (event, ui) {
      if (this.armDelete && this.unpluggingEdge) {
        this.model.parentGraph.removeEdge(this.unpluggingEdge);
      } else {
        this.$(".plugend").show();
        this.unpluggingEdge.view.undim();
      }
      this.armDelete = false;
      this.unpluggingEdge = null;

      this.dragstop(event, ui);
    },
    clickhole: function (event) {
      // Hide previous connected edges editor
      $('div.edge-edit').remove();
        
      var hole = this.$(".hole");
          
      // Show connected edges editor
      var isIn = this.model.isIn;
      var portName = this.model.get("name");
      
      var popupEl = this.popupTemplate(this.model.toJSON());
      popupEl = $(popupEl);
      this.$el.append(popupEl);

      // Close button
      popupEl.children("button.close")
        .click(function(){
          $('div.edge-edit').remove();
          Iframework.selectedPort = null;
        });

      var typeabbr = this.model.get("type").substring(0,3);

      var showForm = false;
      var inputForm = $('<form />')
        .attr({
          "id": this.model.node.id + "_" + this.model.get("name"),
          "class": "manualinput",
          "novalidate": ""
        });
      if (typeabbr === "int" || typeabbr === "num" || typeabbr === "flo" ) {
        showForm = true;
        inputForm.append(
          $("<input />").attr({
            // "type": "number",
            // "min": hole.data("min"),
            // "max": hole.data("max"),
            // "step": "any",
            "value": this.model.node.get("state")[this.model.get("name")],
            "title": 'use equations like "=x*100" to change all incoming values'
          })
        );
      } else if (typeabbr === "col") {
        // Use the spectrum event instead of standard form submit
        showForm = true;
        var color = this.model.node.get("state")[this.model.get("name")];
        var input = $("<input />")
          .attr({
            "type": "text",
            "maxlength": 140,
            "value": color,
            "style": "width: 90%"
          });
        inputForm.append( input );
        // Has to be after added to page
        var self = this;
        input
          .spectrum({
            // color: color,
            showInitial: true,
            showInput: true,
            showAlpha: true,
            showPalette: true,
            palette: [
              Iframework.wireColors,
              ["red", "green", "blue", "purple", "cyan", "magenta", "yellow"],
              ["black", "#333", "#666", "#999", "#AAA", "#CCC", "white"]
            ],
            showSelectionPalette: true,
            localStorageKey: "iframework.settings.colorPalette",
            change: function(color) {
              // TODO change to toString when https://github.com/bgrins/spectrum/issues/92 fixed
              var str = color.toRgbString(); 
              input.val( str );
              self.model.node.receive(portName, str);
              self.model.node.setValue(portName, str);
            },
            hide: function(color) {
              input.show();
            },
            beforeShow: function () {
              input.spectrum("set", input.val());
              input.hide();
            }
          })
          .show(); // Unhide
      } else if (typeabbr === "str") {
        showForm = true;
        inputForm.append(
          $("<input />").attr({
            "type": "text",
            "maxlength": hole.data("max"),
            "value": this.model.node.get("state")[this.model.get("name")]
          })
        );
      } else if (typeabbr === "arr") {
        showForm = true;
        var a = this.model.node.get("state")[this.model.get("name")];
        if (Iframework.util.type(a) !== "array") { a = []; }
        var s = "";
        for (var i=0; i<a.length; i++) {
          s += (i>0 ? ", " : "") + a[i];
        }
        inputForm.append(
          $("<input />").attr({
            "type": "text",
            "value": s
          })
        );
      } else if (typeabbr === "boo") {
        showForm = true;
        var val = this.model.node.get("state")[this.model.get("name")];
        val = (Boolean(val) && val !== "false");
        inputForm.append(
          $("<input />")
            .attr({
              "type": "checkbox",
              "checked": val
            })
        );
      } else if (typeabbr === "ban") {
        inputForm.append("<label>Send bang:</label> ");
        showForm = true;
      }
      if (showForm) {
        inputForm.append(
          $("<button></button>")
            .attr({
              "type": "submit",
              "class": "send icon-ok",
              "title": "send value to module"
            })
        );
        popupEl.append(inputForm);
      }
        
      $("#select_"+this.model.id)
        .button({
          icons: {
            primary: "ui-icon-power"
          }
        });
      if (this.relatedEdges().length > 0) {
        popupEl.append('<h2>disconnect</h2>');
        _.each(this.relatedEdges(), function (edge) {
          var edgeEditEl = this.edgeEditTemplate(edge.view);
          popupEl.append(edgeEditEl);
        }, this);
      }

      // This input's options
      if (this.model.get("options") && this.model.get("options").length > 0) {
        this.$('input').autocomplete({
          minLength: 0,
          source: this.model.get("options")
        });
      }

      // Don't fire click on graph
      event.stopPropagation();
    },
    manualinput: function (event) {
      var inputname = this.model.get("name");
      var type = this.model.get("type");
      var typeabbr = type.substring(0,3);

      var val;
      var saveToState = true;
      if (this.$(".manualinput").children("input")){
        val = this.$(".manualinput").children("input").val();
      }
      if (this.$(".manualinput").children("input:checkbox").length > 0) {
        if (this.$(".manualinput").children("input:checkbox").is(':checked')) {
          val = true;
        } else {
          val = false;
        }
      }
      if (type === "int" || type === "number" || type === "float") {
        if (typeof val === "string" && val.toString().substr(0,1)==="=") {
          // Try to parse equation
        } else if (type === "int") {
          val = parseInt(val, 10);
        } else if (type === "number" || type === "float") {
          val = parseFloat(val);
        }
      }
      if (typeabbr === "arr") {
        try {
          val = JSON.parse( "[" + val + "]" );
        } catch (error) {
          // boo
          return false;
        }
      }
      if (val === undefined) {
        // Bang
        val = "!";
        saveToState = false;
      }
      if (saveToState) {
        this.model.node.setValue(inputname, val);
      }
      this.model.node.receive(inputname, val);
      return false;
    },
    disconnect: function (event) {
      //HACK
      var edge = this.model.parentGraph.get("edges").getByCid( $(event.target).parents(".edge-edit-item").attr("id") );
      if (edge) {
        this.model.parentGraph.removeEdge(edge);
      }
      $('div.edge-edit').remove();
      Iframework.selectedPort = null;

      // Don't bubble
      event.stopPropagation();
    },
    _relatedEdges: null,
    relatedEdges: function () {
      // Resets to null on dis/connect
      if ( this._relatedEdges === null ) {
        this._relatedEdges = this.model.parentGraph.get("edges").filter( function (edge) {
          return ( edge.Source === this.model || edge.Target === this.model );
        }, this);
        // Toggle plugends
        if (this._relatedEdges.length >= 1) {
          this.$(".plugend").show();
        } else {
          this.$(".plugend").hide();
        }
        // this.model.node.view.resetRelatedEdges();
      }
      return this._relatedEdges;
    },
    resetRelatedEdges: function () {
      this._relatedEdges = null;
      this.relatedEdges();
    },
    highlightEdge: function () {
      if (this.relatedEdges().length > 0) {
        // Find top connected wire
        var topConnected = this.topConnectedEdge();
        if (topConnected && topConnected.view) {
          topConnected.view.highlight();
        }
      }
    },
    highlight: function () {
      // Called by edge view
      var plugend = this.$(".plugend");
      plugend.addClass("highlight");
      setTimeout(function(){
        plugend.removeClass("highlight");
      }, 1000);
    },
    publishPort: function () {
      // Make breakout
      var breakout = this.model.parentNode.parentGraph.addNode({
        src: "meemoo:subgraph/input",
        x: 100,
        y: 100,
        w: 80,
        h: 60,
        state: {
          label: this.model.id
        },
        parentGraph: this.model.parentNode.parentGraph
      });
      // Connect edge
      var edge = new Iframework.Edge({
        source: [breakout.id, "data"], 
        target: [this.model.parentNode.id, this.model.id],
        parentGraph: this.model.parentNode.parentGraph
      });
      this.model.parentNode.parentGraph.addEdge( edge );
    }

  });

});
