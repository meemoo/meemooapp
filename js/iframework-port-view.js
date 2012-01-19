$(function(){

  var portInTemplate = 
    '<span class="hole hole-in hole-<%= name %>"></span>'+
    '<span class="label"><%= name %></span>';
    
  var portOutTemplate = 
    '<span class="label"><%= name %></span>'+
    '<span class="hole hole-out hole-<%= name %>"></span>';
    
  var popupTemplate =
    '<div class="edge-edit">'+
    '</div>';

  var edgeEditTemplate =
    '<div class="edge-edit-item" id="<%= model.cid %>">'+
      '<span><%= label() %></span>'+
      '<button class="disconnect">disconnect</button>'+
    '</div>';

  Iframework.PortView = Backbone.View.extend({
    tagName: "div",
    className: "port",
    portInTemplate: _.template(portInTemplate),
    portOutTemplate: _.template(portOutTemplate),
    popupTemplate: _.template(popupTemplate),
    edgeEditTemplate: _.template(edgeEditTemplate),
    events: {
      "mouseover .hole":             "mouseoverhole",
      "mouseout .hole":              "mouseouthole",
      "click .hole":                 "clickhole",
      "dragstart .hole":             "dragstart",
      "drag .hole, .holehelper":     "drag",
      "dragstop .hole, .holehelper": "dragstop",
      "drop":                        "drop",
      "click .disconnect":           "disconnect"
    },
    initialize: function () {
      this.render();
      return this;
    },
    render: function () {
      if (this.model.isIn) {
        $(this.el).html( this.portInTemplate(this.model.toJSON()) );
        $(this.el).addClass("port-in");
      } else {
        $(this.el).html( this.portOutTemplate(this.model.toJSON()) );
        $(this.el).addClass("port-out");
      }

      // Drag from hole
      this.$(".hole")
        .data({
          model: this.model
        })
        .draggable({
          helper: function (e) {
            return $('<span class="holehelper holehelper-in" />');
          }
        })
        .button({
          icons: {
            primary: "ui-icon-arrow-1-e"
          },
          text: false
        });
        
      // Drag to port
      $(this.el).droppable({
        accept: this.model.isIn ? ".hole-out" : ".hole-in",
        hoverClass: "drophover"
      });
      
    },
    mouseoverhole: function(event){
      // Click-connect edge preview
      if ( Iframework.selectedPort && (Iframework.selectedPort.isIn !== this.model.isIn) ) {
        if (!Iframework.edgePreview) {
          var edgePreview = new Iframework.EdgeView();
          Iframework.edgePreview = edgePreview;
          Iframework.shownGraph.view.$(".edges").append( edgePreview.el );
        }
        // Edge preview
        var from = (this.model.isIn ? Iframework.selectedPort : this.model);
        var to = (this.model.isIn ? this.model : Iframework.selectedPort);
        var fromOffset = from.view.$(".hole").offset();
        var toOffset = to.view.$(".hole").offset();
        var positions = {
          fromX: fromOffset.left + 7,
          fromY: fromOffset.top + 7,
          toX: toOffset.left + 7,
          toY: toOffset.top + 7
        };
        Iframework.edgePreview.setPositions(positions);
        Iframework.edgePreview.tapPreview = true;
        Iframework.edgePreview.redraw();
      }
    },
    mouseouthole: function(event){
      // Click-connect edge preview
      if ( Iframework.edgePreview && Iframework.edgePreview.tapPreview) {
        Iframework.shownGraph.view.$(".edges").children(".preview").remove();
        Iframework.edgePreview = undefined;
      }
    },
    dragstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      Iframework.maskFrames();
      
      // Highlight all ins or outs
      $("div.ports-"+(this.model.isIn ? "out" : "in")+" span.hole").addClass("highlight");
      
      // Edge preview
      var edgePreview = new Iframework.EdgeView();
      Iframework.edgePreview = edgePreview;
      Iframework.shownGraph.view.$(".edges").append( edgePreview.el );

      // Don't drag module
      event.stopPropagation();
    },
    drag: function (event, ui) {
      if (Iframework.edgePreview) {
        var dragX = ui.offset.left + 7;
        var dragY = ui.offset.top + 7;
        var thisX = this.$(".hole").offset().left + 7;
        var thisY = this.$(".hole").offset().top + 7;
        
        // Edge preview
        var positions = {
          fromX: (this.model.isIn ? dragX : thisX),
          fromY: (this.model.isIn ? dragY : thisY),
          toX: (this.model.isIn ? thisX : dragX),
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
      Iframework.shownGraph.view.$(".edges").children(".preview").remove();
      Iframework.edgePreview = undefined;

      // Don't drag module
      event.stopPropagation();
    },
    drop: function (event, ui) {
      var from = $(ui.draggable).data("model");
      var to = this.model;
      var source = (this.model.isIn ? from : to);
      var target = (this.model.isIn ? to : from);
      var edge = new Iframework.Edge({
        source: [source.node.get("id"), source.get("name")],
        target: [target.node.get("id"), target.get("name")]
      });
      edge.graph = this.model.graph;
      if (edge.graph.addEdge(edge)){
        edge.connect();
      }

      // Don't bubble
      event.stopPropagation();
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
      } else {
        Iframework.selectedPort = this.model;
      }
          
      var offset = hole.offset();
      var popupEl = $('<div class="edge-edit" />').css({
        left: offset.left,
        top: offset.top + 15
      });
      // Port's module as parent
      $(this.model.node.view.el).append(popupEl);
      popupEl.append(
        $('<button />')
          .attr({
            "type": "button",
            "class": "close",
            "title": "close"
          })
          .button({
            icons: {
              primary: "ui-icon-close"
            },
            text: false
          })
          .click(function(){
            $('div.edge-edit').remove();
            Iframework.selectedPort = null;
          })
      );
      popupEl.append('<h2>'+portName+' ('+this.model.get("type")+')</h2><p>'+this.model.get("description")+'</p>');
      var typeabbr = this.model.get("type").substring(0,3);
      if (isIn) {
        var showForm = false;
        var inputForm = $("<form />")
          .data({
            "modulecid": this.model.cid,
            "inputname": portName
          })
          .submit(function(e){
            var module = Iframework.shownGraph.get("nodes").getByCid( $(this).data("modulecid") );
            var inputname = $(this).data("inputname");
            if (module && inputname) {
              var message = {};
              message[inputname] = $(this).children("input").length > 0 ? $(this).children("input").val() : "bang!";
              module.send(message);
            }
            return false;
          });
        if (typeabbr === "int" || typeabbr === "num" ) {
          showForm = true;
          inputForm.append(
            $("<input />").attr({
              "type": "number",
              "min": hole.data("min"),
              "max": hole.data("max"),
            })
          );
        } else if (typeabbr === "col" || typeabbr === "str") {
          showForm = true;
          inputForm.append(
            $("<input />").attr({
              "type": "text",
              "maxlength": hole.data("max")
            })
          );
        } else if (typeabbr === "ban") {
          inputForm.append("<label>Send bang:</label> ");
          showForm = true;
        }
        if (showForm) {
          inputForm.append(
            $("<button />").attr({
              "type": "submit",
              "class": "send",
              "title": "send value to module"
            }).button({
              icons: {
                primary: "ui-icon-check"
              },
              text: false
            })
          );
          popupEl.append(inputForm);
        }
      }
      popupEl.append('<h2>connect</h2><p>(click on the other port)</p>');
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

      // Don't fire click on graph
      event.stopPropagation();
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
        return holeoffset.left + 7;
      } else {
        return 0;
      }
    },
    portOffsetTop: function () {
      var holeoffset = this.$('.hole').offset();
      if (holeoffset) {
        return holeoffset.top + 7;
      } else {
        return 0;
      }
    },
    _relatedEdges: null,
    relatedEdges: function () {
      // i10n? Don't have to filter through all edges, just ones connected to this node
      // Resets to null on dis/connect
      //if ( this._relatedEdges === null ) {
        this._relatedEdges = this.model.graph.get("edges").filter( function (edge) {
          return ( edge.source === this.model || edge.target === this.model );
        }, this);
      //}
      return this._relatedEdges;
    },

  });

});
