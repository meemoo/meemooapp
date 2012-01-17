$(function(){

  Iframework.PortView = Backbone.View.extend({
    tagName: "div",
    className: "port",
    portInTemplate: _.template($('#port-in-template').html()),
    portOutTemplate: _.template($('#port-out-template').html()),
    edgeEditTemplate: _.template($('#edge-edit-template').html()),
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
        .draggable({
          helper: function (e) {
            var helper = $('<span class="holehelper holehelper-in" />');
            return helper;
          }
        }).button({
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
      // Tap-connect edge preview
      if ( Iframework.selectedPort && !Iframework.selectedPort.isIn ) {
        var edgePreview = new Iframework.EdgeView();
        Iframework.edgePreview = edgePreview;
        Iframework.shownGraph.view.$(".edges").append( edgePreview.el );
        // Edge preview
        var fromOffset = Iframework.selectedPort.node.view.$(".ports-out .hole-"+Iframework.selectedPort.portName).offset();
        var positions = {
          fromX: fromOffset.left + 7,
          fromY: fromOffset.top + 7,
          toX: $(this).offset().left + 7,
          toY: $(this).offset().top + 7
        };
        Iframework.edgePreview.setPositions(positions);
        Iframework.edgePreview.redraw();
      }
    },
    mouseouthole: function(event){
      // Tap-connect edge preview
      if ( Iframework.selectedPort && !Iframework.selectedPort.isIn ) {
        Iframework.shownGraph.view.$(".edges").children(".preview").remove();
        Iframework.edgePreview = undefined;
      }
    },
    dragstart: function (event, ui) {
      // Add a mask so that iframes don't steal mouse
      Iframework.maskFrames();
      
      // All outs
      if (this.model.isIn) {
        $("div.ports-out span.hole").addClass("highlight");
      } else {
        $("div.ports-in span.hole").addClass("highlight");
      }
      
      // Edge preview
      var edgePreview = new Iframework.EdgeView();
      Iframework.edgePreview = edgePreview;
      Iframework.shownGraph.view.$(".edges").append( edgePreview.el );
    },
    drag: function (event, ui) {
      var dragX = ui.offset.left + 7;
      var dragY = ui.offset.top + 7;
      var thisX = this.$(".hole").offset().left + 7;
      var thisY = this.$(".hole").offset().top + 7;
      
      // Edge preview
      var positions = {
        fromX: this.model.isIn ? thisX : dragX,
        fromY: this.model.isIn ? thisY : dragY,
        toX: this.model.isIn ? dragX : thisX,
        toY: this.model.isIn ? dragY : thisY
      };
      Iframework.edgePreview.setPositions(positions);
      Iframework.edgePreview.redraw();
    },
    dragstop: function (event, ui) {
      // Remove iframe masks
      Iframework.unmaskFrames();

      $(".hole").removeClass("highlight");
      
      // Edge preview
      Iframework.shownGraph.view.$(".edges").children(".preview").remove();
      Iframework.edgePreview = undefined;
    },
    drop: function (event, ui) {
      var source = ui.draggable;
      var target = $(this).children(".hole");
      var edge = new Iframework.Edge({
        source: [source.data().nodeId, source.data().portName],
        target: [target.data().nodeId, target.data().portName]
      });
      edge.graph = Iframework.shownGraph;
      if (edge.graph.addEdge(edge)){
        edge.connect();
      }
    },
    
    
    
    
    

    addOutput: function (info) {
      var el = this.portOutTemplate(info);
      this.$(".ports-out").append(el);
      // Drag from hole
      this.$("div.ports-out span.hole-"+info.name)
        .data({
          nodeId: this.model.get("id"),
          portName: info.name,
          description: info.description,
          type: info.type,
          min: info.min,
          max: info.max
        }).draggable({
          helper: function (e) {
            var helper = $('<span class="holehelper holehelper-out" />');
            return helper;
          },
          start: function (event, ui) {
            // All ins
            $("div.ports-in span.hole").addClass("highlight");
            
            // Edge preview
            var edgePreview = new Iframework.EdgeView();
            Iframework.edgePreview = edgePreview;
            Iframework.shownGraph.view.$(".edges").append( edgePreview.el );
          },
          drag: function (event, ui) {
            // Edge preview
            var positions = {
              fromX: $(this).offset().left + 7,
              fromY: $(this).offset().top + 7,
              toX: ui.offset.left + 7,
              toY: ui.offset.top + 7
            };
            Iframework.edgePreview.setPositions(positions);
            Iframework.edgePreview.redraw();
          },
          stop: function (event, ui) {
            $("div.ports-in span.hole").removeClass("highlight");
            
            // Edge preview
            Iframework.shownGraph.view.$(".edges").children(".preview").remove();
            Iframework.edgePreview = undefined;
          }
        }).button({
          icons: {
            primary: "ui-icon-arrow-1-e"
          },
          text: false
        }).mouseover(function(){
          // Tap-connect edge preview
          if ( Iframework.selectedPort && Iframework.selectedPort.isIn ) {
            var edgePreview = new Iframework.EdgeView();
            Iframework.edgePreview = edgePreview;
            Iframework.shownGraph.view.$(".edges").append( edgePreview.el );
            // Edge preview
            var fromOffset = Iframework.selectedPort.node.view.$(".ports-in .hole-"+Iframework.selectedPort.portName).offset();
            var positions = {
              fromX: $(this).offset().left + 7,
              fromY: $(this).offset().top + 7,
              toX: fromOffset.left + 7,
              toY: fromOffset.top + 7
            };
            Iframework.edgePreview.setPositions(positions);
            Iframework.edgePreview.redraw();
          }
        }).mouseout(function(){
          // Tap-connect edge preview
          if ( Iframework.selectedPort && Iframework.selectedPort.isIn ) {
            Iframework.shownGraph.view.$(".edges").children(".preview").remove();
            Iframework.edgePreview = undefined;
          }
        });
      // Drag to port
      this.$("div.ports-out div.port-"+info.name).droppable({
        accept: ".hole-in",
        hoverClass: "drophover",
        drop: function(event, ui) {
          var source = $(this).children(".hole");
          var target = ui.draggable;
          var edge = new Iframework.Edge({
            source: [source.data().nodeId, source.data().portName],
            target: [target.data().nodeId, target.data().portName]
          });
          edge.graph = Iframework.shownGraph;
          if (edge.graph.addEdge(edge)){
            edge.connect();
          }
        }
      });
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
            source: [Iframework.selectedPort.node.id, Iframework.selectedPort.portName],
            target: [this.model.id, portName]
          });
        } else {
          var edge = new Iframework.Edge({
            source: [this.model.id, portName],
            target: [Iframework.selectedPort.node.id, Iframework.selectedPort.portName]
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
        Iframework.selectedPort = {
          node: this.model,
          isIn: isIn,
          portName: portName
        };
      }
          
      var offset = hole.offset();
      var popupEl = $('<div class="edge-edit" />').css({
        left: offset.left,
        top: offset.top + 15
      });
      // Port's module as parent
      $(this.model.view.el).append(popupEl);
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
      popupEl.append('<h2>'+portName+' ('+hole.data("type")+')</h2><p>'+hole.data("description")+'</p>');
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
    },
    disconnect: function (event) {
      //HACK
      var edge = this.model.graph.get("edges").getByCid( $(event.target).parents(".edge-edit-item").attr("id") );
      if (edge) {
        this.model.graph.removeEdge(edge);
      }
      $('div.edge-edit').remove();
      Iframework.selectedPort = null;
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
