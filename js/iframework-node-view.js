$(function(){

  window.Iframework.NodeView = Backbone.View.extend({
    tagName: "div",
    className: "node",
    template: _.template($('#node-template').html()),
    portInTemplate: _.template($('#port-in-template').html()),
    portOutTemplate: _.template($('#port-out-template').html()),
    edgeEditTemplate: _.template($('#edge-edit-template').html()),
    events: {
      "dragstart .module":   "dragstart",
      "drag .module":        "drag",
      "dragstop .module":    "dragstop",
      "resizestart .module": "resizestart",
      "resize .module":      "resize",
      "resizestop .module":  "resizestop",
      "click .hole":         "holeclick",
      "click .disconnect":   "disconnect"
    },
    initialize: function () {
      this.render();
      this.$(".module")
        .mousedown( function (event) {
          $("div.module").removeClass("active");
          $(event.target).addClass("active");
          // Bring to top
          var topZ = 0;
          $("div.nodes div.module").each(function(){
            var thisZ = Number($(this).css("z-index"));
            if (thisZ > topZ) { topZ = thisZ; } 
          });
          $(this).css("z-index", topZ+1);
        })
        .draggable()
        .resizable();
    },
    render: function () {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
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
      window.Iframework.maskFrames();
    },
    drag: function (event, ui) {
      _.each(this.relatedEdges(), function(edge){
        edge.view.redraw();
      });
    },
    dragstop: function (event, ui) {
      // Remove iframe masks
      window.Iframework.unmaskFrames();
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
      window.Iframework.maskFrames();
    },
    resize: function (event, ui) {
      // Rerender related edges
      this.drag();
    },
    resizestop: function (event, ui) {
      // Remove iframe masks
      window.Iframework.unmaskFrames();
      
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
    infoLoaded: function (info) {
      this.$('h1')
        .text(this.model.frameIndex + ":" + info.title)
        .attr({
          title: "by "+info.author+": "+info.description
        });
    },
    addInput: function (info) {
      var newIn = this.portInTemplate(info);
      this.$("div.ports-in").append(newIn);
      // Drag from hole
      this.$("div.ports-in span.hole-"+info.name)
        .data({
          nodeId: this.model.get("id"),
          portName: info.name,
          description: info.description,
          type: info.type,
          min: info.min,
          max: info.max
        }).draggable({
          helper: function (e) {
            var helper = $('<span class="holehelper holehelper-in" />');
            return helper;
          },
          start: function (event, ui) {
            // All outs
            $("div.ports-out span.hole").addClass("highlight");
            
            // Edge preview
            var edgePreview = new EdgeView();
            window.Iframework.edgePreview = edgePreview;
            window.Iframework.shownGraph.view.$(".edges").append( edgePreview.el );
          },
          drag: function (event, ui) {
            // Edge preview
            var positions = {
              fromX: ui.offset.left + 7,
              fromY: ui.offset.top + 7,
              toX: $(this).offset().left + 7,
              toY: $(this).offset().top + 7
            };
            window.Iframework.edgePreview.setPositions(positions);
            window.Iframework.edgePreview.redraw();
          },
          stop: function (event, ui) {
            $("div.ports-out span.hole").removeClass("highlight");
            
            // Edge preview
            window.Iframework.shownGraph.view.$(".edges").children(".preview").remove();
            window.Iframework.edgePreview = undefined;
          }
        }).button({
          icons: {
            primary: "ui-icon-arrow-1-e"
          },
          text: false
        }).mouseover(function(){
          // Tap-connect edge preview
          if ( window.Iframework.selectedPort && !window.Iframework.selectedPort.isIn ) {
            var edgePreview = new EdgeView();
            window.Iframework.edgePreview = edgePreview;
            window.Iframework.shownGraph.view.$(".edges").append( edgePreview.el );
            // Edge preview
            var fromOffset = window.Iframework.selectedPort.node.view.$(".ports-out .hole-"+window.Iframework.selectedPort.portName).offset();
            var positions = {
              fromX: fromOffset.left + 7,
              fromY: fromOffset.top + 7,
              toX: $(this).offset().left + 7,
              toY: $(this).offset().top + 7
            };
            window.Iframework.edgePreview.setPositions(positions);
            window.Iframework.edgePreview.redraw();
          }
        }).mouseout(function(){
          // Tap-connect edge preview
          if ( window.Iframework.selectedPort && !window.Iframework.selectedPort.isIn ) {
            window.Iframework.shownGraph.view.$(".edges").children(".preview").remove();
            window.Iframework.edgePreview = undefined;
          }
        });
      // Drag to port
      this.$("div.ports-in div.port-"+info.name).droppable({
        // Make new edge
        accept: ".hole-out",
        hoverClass: "drophover",
        drop: function(event, ui) {
          var source = ui.draggable;
          var target = $(this).children(".hole");
          var edge = new Edge({
            source: [source.data().nodeId, source.data().portName],
            target: [target.data().nodeId, target.data().portName]
          });
          edge.graph = window.Iframework.shownGraph;
          if (edge.graph.addEdge(edge)){
            edge.connect();
          }
        }
      });
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
            var edgePreview = new EdgeView();
            window.Iframework.edgePreview = edgePreview;
            window.Iframework.shownGraph.view.$(".edges").append( edgePreview.el );
          },
          drag: function (event, ui) {
            // Edge preview
            var positions = {
              fromX: $(this).offset().left + 7,
              fromY: $(this).offset().top + 7,
              toX: ui.offset.left + 7,
              toY: ui.offset.top + 7
            };
            window.Iframework.edgePreview.setPositions(positions);
            window.Iframework.edgePreview.redraw();
          },
          stop: function (event, ui) {
            $("div.ports-in span.hole").removeClass("highlight");
            
            // Edge preview
            window.Iframework.shownGraph.view.$(".edges").children(".preview").remove();
            window.Iframework.edgePreview = undefined;
          }
        }).button({
          icons: {
            primary: "ui-icon-arrow-1-e"
          },
          text: false
        }).mouseover(function(){
          // Tap-connect edge preview
          if ( window.Iframework.selectedPort && window.Iframework.selectedPort.isIn ) {
            var edgePreview = new EdgeView();
            window.Iframework.edgePreview = edgePreview;
            window.Iframework.shownGraph.view.$(".edges").append( edgePreview.el );
            // Edge preview
            var fromOffset = window.Iframework.selectedPort.node.view.$(".ports-in .hole-"+window.Iframework.selectedPort.portName).offset();
            var positions = {
              fromX: $(this).offset().left + 7,
              fromY: $(this).offset().top + 7,
              toX: fromOffset.left + 7,
              toY: fromOffset.top + 7
            };
            window.Iframework.edgePreview.setPositions(positions);
            window.Iframework.edgePreview.redraw();
          }
        }).mouseout(function(){
          // Tap-connect edge preview
          if ( window.Iframework.selectedPort && window.Iframework.selectedPort.isIn ) {
            window.Iframework.shownGraph.view.$(".edges").children(".preview").remove();
            window.Iframework.edgePreview = undefined;
          }
        });
      // Drag to port
      this.$("div.ports-out div.port-"+info.name).droppable({
        accept: ".hole-in",
        hoverClass: "drophover",
        drop: function(event, ui) {
          var source = $(this).children(".hole");
          var target = ui.draggable;
          var edge = new Edge({
            source: [source.data().nodeId, source.data().portName],
            target: [target.data().nodeId, target.data().portName]
          });
          edge.graph = window.Iframework.shownGraph;
          if (edge.graph.addEdge(edge)){
            edge.connect();
          }
        }
      });
    },
    holeclick: function (event) {
      // Hide previous connected edges editor
      $('div.edge-edit').remove();
        
      //HACK for .ui-icon jqueryui button
      var target = $(event.target);
      var hole = target.is(".hole") ? target : target.parent();
          
      // Show connected edges editor
      var isIn = hole.hasClass("hole-in");
      var portName = hole.data("portName");
  
      if ( window.Iframework.selectedPort && (isIn !== window.Iframework.selectedPort.isIn) ) {
        // Connect
        if (isIn) {
          var edge = new Edge({
            source: [window.Iframework.selectedPort.node.id, window.Iframework.selectedPort.portName],
            target: [this.model.id, portName]
          });
        } else {
          var edge = new Edge({
            source: [this.model.id, portName],
            target: [window.Iframework.selectedPort.node.id, window.Iframework.selectedPort.portName]
          });
        }
        edge.graph = window.Iframework.shownGraph;
        if (edge.graph.addEdge(edge)){
          edge.connect();
        }
        // Tap-connect edge preview
        if ( window.Iframework.edgePreview ) {
          window.Iframework.shownGraph.view.$(".edges").children(".preview").remove();
          window.Iframework.edgePreview = undefined;
        }
        // Don't show popup
        window.Iframework.selectedPort = null;
        return;
      } else {
        window.Iframework.selectedPort = {
          node: this.model,
          isIn: isIn,
          portName: portName
        };
      }
          
      //HACK
      this._relatedEdges = null;
      var connectedEdges = _.filter(this.relatedEdges(), function (edge) {
        return ( (isIn && portName === edge.get("target")[1]) || (!isIn && portName === edge.get("source")[1]) );
      });
      
      var popupEl = $('<div class="edge-edit" />').css({
        left: event.pageX, 
        top: event.pageY
      });
      // Port's module as parent
      $(this.el).append(popupEl);
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
            window.Iframework.selectedPort = null;
          })
      );
      popupEl.append('<h2>'+portName+' ('+hole.data("type")+')</h2><p>'+hole.data("description")+'</p>');
      var typeabbr = hole.data("type").substring(0,3);
      if (isIn) {
        var showForm = false;
        var inputForm = $("<form />")
          .data({
            "modulecid": this.model.cid,
            "inputname": portName
          })
          .submit(function(e){
            var module = window.Iframework.shownGraph.get("nodes").getByCid( $(this).data("modulecid") );
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
      if (connectedEdges.length > 0) {
        popupEl.append('<h2>disconnect</h2>');
        _.each(connectedEdges, function (edge) {
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
      window.Iframework.selectedPort = null;
    },
    portOffsetLeft: function (outin, name) {
      return this.$('div.port-'+outin+' span.hole-'+name).offset().left + 7;
    },
    portOffsetTop: function (outin, name) {
      return this.$('div.port-'+outin+' span.hole-'+name).offset().top + 7;
    }
  });

});
