$(function(){

  var portInTemplate = 
    '<div class="portshown portshown-in">'+
      '<span class="hole hole-in hole-<%= name %> hole-<%= type_class %>"></span>'+
      '<span class="label"><%= name %></span>'+
    '</div>'+
    '<span class="plugend plugend-in"></span>';
    
  var portOutTemplate = 
    '<div class="portshown portshown-out">'+
      '<span class="label"><%= name %></span>'+
      '<span class="hole hole-out hole-<%= name %> hole-<%= type_class %>"></span>'+
    '</div>'+
    '<span class="plugend plugend-out"></span>';
    
  var popupTemplate =
    '<div class="edge-edit">'+
      '<button class="close">close</button>'+
      '<h2><%= name %> (<%= type %>)</h2>'+
      '<p><%= description %></p>'+
    '</div>';

  var edgeEditTemplate =
    '<div class="edge-edit-item" id="<%= model.cid %>">'+
      '<span><%= label() %></span>'+
      '<button class="disconnect" type="button">disconnect</button>'+
    '</div>';

  Iframework.PortView = Backbone.View.extend({
    tagName: "div",
    className: "port",
    portInTemplate: _.template(portInTemplate),
    portOutTemplate: _.template(portOutTemplate),
    popupTemplate: _.template(popupTemplate),
    edgeEditTemplate: _.template(edgeEditTemplate),
    events: {
      "click .hole":                 "clickhole",
      "dragstart .hole":             "dragstart",
      "drag .hole, .holehelper":     "drag",
      "dragstop .hole, .holehelper": "dragstop",
      "dragstart .plugend":          "unplugstart",
      "drag .plugend":               "unplugdrag",
      "dragstop .plugend":           "unplugstop",
      "drop":                        "drop",
      "click .disconnect":           "disconnect",
      "submit .manualinput":         "manualinput"
    },
    initialize: function () {
      this.render();
      return this;
    },
    render: function () {
      if (this.model.isIn) {
        this.$el.html( this.portInTemplate(this.model.toJSON()) );
        this.$el.addClass("port-in");
        this.$(".hole")
          .draggable({
            helper: function (e) {
              return $('<span class="holehelper holehelper-out" />');
            }
          })
        this.$(".plugend")
          .draggable({
            helper: function (e) {
              return $('<span class="plugendhelper plugendhelper-in" />');
            }
          })
      } else {
        this.$el.html( this.portOutTemplate(this.model.toJSON()) );
        this.$el.addClass("port-out");
        this.$(".hole")
          .draggable({
            helper: function (e) {
              return $('<span class="holehelper holehelper-in" />');
            }
          })
        this.$(".plugend")
          .draggable({
            helper: function (e) {
              return $('<span class="plugendhelper plugendhelper-out" />');
            }
          })
      }

      // Drag from hole
      this.$(".hole")
        .data({
          model: this.model
        })
        .button({
          icons: {
            primary: "ui-icon-arrow-1-e"
          },
          text: false
        });
        
      // Drag to port
      this.$el.droppable({
        accept: this.model.isIn ? ".hole-out, .plugend-in" : ".hole-in, .plugend-out",
        hoverClass: "drophover"
      });

      this.$(".plugend").hide();
      
    },
    dragstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      Iframework.maskFrames();
      
      // Highlight all ins or outs
      // $("div.ports-"+(this.model.isIn ? "out" : "in")+" span.hole").addClass("highlight");
      $("div.ports-"+(this.model.isIn ? "out" : "in")+" span.hole-" + this.model.get('type_class'))
        .addClass('highlight');
      
      // Edge preview
      var edgePreview = new Iframework.EdgeView();
      Iframework.edgePreview = edgePreview;
      this.$('.plugend').show();

      // Don't drag module
      event.stopPropagation();
    },
    drag: function (event, ui) {
      if (Iframework.edgePreview) {
        var dragX = ui.offset.left + $('.graph').scrollLeft();
        var dragY = ui.offset.top + 6 + $('.graph').scrollTop();
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
      Iframework.unmaskFrames();

      $(".hole").removeClass("highlight");
      
      // Edge preview
      Iframework.edgePreview.remove();
      Iframework.edgePreview = undefined;

      // Don't drag module
      event.stopPropagation();
    },
    drop: function (event, ui) {
      // HACK will drop always fire before dragstop?
      if (this.armDelete) {
        // Don't disconnect or reconnect wire dragged back to same port
        this.armDelete = false;
      } else {
        var from = $(ui.draggable).data("model");
        var to = this.model;
        var source = (this.model.isIn ? from : to);
        var target = (this.model.isIn ? to : from);
        var edge = new Iframework.Edge({
          source: [source.node.get("id"), source.get("name")],
          target: [target.node.get("id"), target.get("name")]
        });
        edge.graph = this.model.graph;
        if (Iframework.edgePreview) {
          edge._color = Iframework.edgePreview._color;
        }
        if (edge.graph.addEdge(edge)){
          edge.connect();
        }
      }
      // Don't bubble
      event.stopPropagation();
    },
    unpluggingEdge: null,
    armDeleteTimeout: null,
    armDelete: false,
    unplugstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      Iframework.maskFrames();

      // Find top connected wire
      var lastConnected;
      var countConnected = 0;
      this.model.graph.get("edges").each(function(edge){
        if (edge.source === this.model || edge.target === this.model) {
          countConnected++;
          lastConnected = edge;
        }
      }, this);

      if (!lastConnected) { return false; }

      this.unpluggingEdge = lastConnected;
      this.unpluggingEdge.view.dim();
      if (countConnected===1) {
        this.$(".plugend").hide();
      }

      var thatPort = this.model.isIn ? this.unpluggingEdge.source : this.unpluggingEdge.target;
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
        var dragX = ui.offset.left + $('.graph').scrollLeft();
        var dragY = ui.offset.top + 6 + $('.graph').scrollTop();
        var thatPortView = this.model.isIn ? this.unpluggingEdge.source.view : this.unpluggingEdge.target.view;
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
        this.model.graph.removeEdge(this.unpluggingEdge);
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
  
      if ( Iframework.selectedPort && (isIn !== Iframework.selectedPort.isIn) ) {
        // Connect
        if (isIn) {
          var edge = new Iframework.Edge({
            source: [Iframework.selectedPort.node.get("id"), Iframework.selectedPort.get("name")],
            target: [this.model.node.get("id"), this.model.get("name")]
          });
        } else {
          var edge = new Iframework.Edge({
            source: [this.model.node.get("id"), this.model.get("name")],
            target: [Iframework.selectedPort.node.get("id"), Iframework.selectedPort.get("name")]
          });
        }
        edge.graph = Iframework.shownGraph;
        if (edge.graph.addEdge(edge)){
          edge.connect();
        }
        // Tap-connect edge preview
        if ( Iframework.edgePreview ) {
          Iframework.shownGraph.view.$(".edges").children(".preview").remove();
          Iframework.edgePreview = undefined;
        }
        // Don't show popup
        Iframework.selectedPort = null;
        return;
      } 
      
      // var popupEl = $('<div class="edge-edit" />');
      var popupEl = this.popupTemplate(this.model.toJSON());
      popupEl = $(popupEl);
      this.$el.append(popupEl);

      // Close button
      popupEl.children("button.close")
        .button({
          icons: {
            primary: "ui-icon-close"
          },
          text: false
        })
        .click(function(){
          $('div.edge-edit').remove();
          Iframework.selectedPort = null;
        });

      var typeabbr = this.model.get("type").substring(0,3);
      if (isIn) {
        var showForm = false;
        var inputForm = $('<form />')
          .attr({
            "id": this.model.node.id + "_" + this.model.get("name"),
            "class": "manualinput"
          });
        if (typeabbr === "int" || typeabbr === "num" ) {
          showForm = true;
          inputForm.append(
            $("<input />").attr({
              "type": "number",
              "min": hole.data("min"),
              "max": hole.data("max"),
              "value": this.model.node.get("state")[this.model.get("name")]
            })
          );
        } else if (typeabbr === "col" || typeabbr === "str") {
          showForm = true;
          inputForm.append(
            $("<input />").attr({
              "type": "text",
              "maxlength": hole.data("max"),
              "value": this.model.node.get("state")[this.model.get("name")]
            })
          );
        } else if (typeabbr === "boo") {
          showForm = true;
          var val = this.model.node.get("state")[this.model.get("name")];
          val = (Boolean(val) && val != "false");
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
              .html("send")
              .attr({
                "type": "submit",
                "class": "send",
                "title": "send value to module"
              })
              .button({
                icons: {
                  primary: "ui-icon-check"
                },
                text: false
              })
          );
          popupEl.append(inputForm);
        }
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
        $(".disconnect").button({
          icons: {
            primary: "ui-icon-scissors"
          },
          text: false
        });
      }

      // This input's options
      if (this.model.get("options") && this.model.get("options").length > 0) {
        console.log(this.model.get("options"));
        this.$('input').autocomplete({
          minLength: 0,
          source: this.model.get("options"),
        });
      }

      // Don't fire click on graph
      event.stopPropagation();
    },
    manualinput: function (event) {
      var inputname = this.model.get("name");
      var val = this.$(".manualinput").children("input") ? this.$(".manualinput").children("input").val() : "bang!";
      if (this.$(".manualinput").children("input:checkbox").length > 0) {
        if (this.$(".manualinput").children("input:checkbox").is(':checked')) {
          val = true;
        } else {
          val = false;
        }
      }
      if (this.model.get("type") === "int") {
        val = parseInt(val);
      }
      if (this.model.get("type") === "number") {
        val = parseFloat(val);
      }
      var message = {};
      message[inputname] = val;
      this.model.node.send(message);
      this.model.node.get("state")[inputname] = val;
      this.model.node.trigger("change");
      $('div.edge-edit').remove();
      return false;
    },
    disconnect: function (event) {
      //HACK
      var edge = this.model.graph.get("edges").getByCid( $(event.target).parents(".edge-edit-item").attr("id") );
      if (edge) {
        this.model.graph.removeEdge(edge);
      }
      $('div.edge-edit').remove();
      Iframework.selectedPort = null;

      // Don't bubble
      event.stopPropagation();
    },
    portOffsetLeft: function () {
      var holeoffset = this.$('.hole').offset();
      if (holeoffset) {
        // HACK
        return holeoffset.left + 7 + $('.graph').scrollLeft();
      } else {
        return 0;
      }
    },
    portOffsetTop: function () {
      var holeoffset = this.$('.hole').offset();
      if (holeoffset) {
        // HACK
        return holeoffset.top + 7 + $('.graph').scrollTop();
      } else {
        return 0;
      }
    },
    _relatedEdges: null,
    relatedEdges: function () {
      // Resets to null on dis/connect
      if ( this._relatedEdges === null ) {
        this._relatedEdges = this.model.graph.get("edges").filter( function (edge) {
          return ( edge.source === this.model || edge.target === this.model );
        }, this);
        // Toggle plugends
        if (this._relatedEdges.length >= 1) {
          this.$(".plugend").show();
        } else {
          this.$(".plugend").hide();
        }
        this.model.node.view.resetRelatedEdges();
      }
      return this._relatedEdges;
    },
    resetRelatedEdges: function () {
      this._relatedEdges = null;
      this.relatedEdges();
    }

  });

});
