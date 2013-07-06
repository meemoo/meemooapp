$(function(){

  Iframework.EdgeView = Backbone.View.extend({
    tagName: "div",
    className: "edge",
    // template: _.template(template),
    positions: null,
    graphSVGElement: null,
    // This is the only view that doesn't follow the Backbone convention, for the sake of the universal SVG
    elementGroup: null,
    elementWire: null,
    elementShadow: null,
    isPreview: false,
    initialize: function () {
      if (this.model) {
        this.graphSVGElement = this.model.parentGraph.view.edgesSvg;
      } else {
        // Preview edge
        this.graphSVGElement = Iframework.shownGraph.view.edgesSvg;
      }
      this.positions = {fromX: 0, fromY: 0, toX: 0, toY: 0};
      if (!this.model) {
        this.isPreview = true;
      }
      if (this.model && this.model._color) {
        this._color = this.model._color;
      }
      this.render();

      if (this.model) {
        // Used to know which wire is on top when pulling from plugend
        this._z = this.model.parentGraph.edgeCount++;

        $(this.elementWire)
          .data({
            "model": this.model
          })
          .click( function(event){
            $(event.target).data("model").view.click(event);
          });

        // Listen for changes to redraw
        if (this.model.Source) {
          this.model.Source.parentNode.on("change:x change:y change:w change:h", this.redraw, this);
        }
        if (this.model.Target) {
          this.model.Target.parentNode.on("change:x change:y", this.redraw, this);
        }
      }
    },
    render: function () {
      this.calcPositions();

      this.elementGroup = this.makeSVG('g', {
        "transform": "translate("+this.svgX()+","+this.svgY()+")",
        "class": "wire-group"+(this.isPreview ? " preview" : "")
      });

      this.elementShadow = this.makeSVG('path', {
        "class": "wire-shadow",
        "d": this.svgPathShadow()
      });
      this.elementWire = this.makeSVG('path', {
        "class": "wire",
        "d": this.svgPath(),
        "stroke": this.color()
      });

      this.elementGroup.appendChild(this.elementShadow);
      this.elementGroup.appendChild(this.elementWire);

      this.graphSVGElement.appendChild(this.elementGroup);

      // Unhide port plugends
      if (this.model) {
        this.model.Source.view.$(".plugend").show();
        this.model.Target.view.$(".plugend").show();
        this.model.parentGraph.view.resizeEdgeSVG();
      }

      return this;
    },
    redraw: function () {
      this.calcPositions();
      $(this.elementGroup).attr( "transform", "translate("+this.svgX()+", "+this.svgY()+")" );
      $(this.elementWire).attr( "d", this.svgPath() );
      $(this.elementShadow).attr( "d", this.svgPathShadow() );

      if (this.model) {
        this.model.parentGraph.view.resizeEdgeSVG();
      } else {
        Iframework.shownGraph.view.resizeEdgeSVG();
      }
    },
    remove: function () {
      $(this.elementGroup).remove();
    },
    setPositions: function (_positions) {
      this.positions = _positions;
    },
    calcPositions: function () {
      if (this.model) {
        // Connected edge
        var sourceName = this.model.get("source")[1];
        var targetName = this.model.get("target")[1];
        this.positions.fromX = this.model.Source.view.portOffsetLeft('out', sourceName);
        this.positions.fromY = this.model.Source.view.portOffsetTop('out', sourceName);
        this.positions.toX = this.model.Target.view.portOffsetLeft('in', targetName);
        this.positions.toY = this.model.Target.view.portOffsetTop('in', targetName);
      }
    },
    svgX: function () {
      return Math.min(this.positions.toX, this.positions.fromX) - 50;
    },
    svgY: function () {
      return Math.min(this.positions.toY, this.positions.fromY) - 25;
    },
    svgW: function () {
      return Math.abs(this.positions.toX - this.positions.fromX) + 100;
    },
    svgH: function () {
      return Math.abs(this.positions.toY - this.positions.fromY) + 50;
    },
    pathStraight: 35,
    pathCurve: 60,
    svgPath: function () {
      var fromX = this.positions.fromX - this.svgX();
      var fromY = this.positions.fromY - this.svgY();
      var toX = this.positions.toX - this.svgX();
      var toY = this.positions.toY - this.svgY();
      return "M "+ fromX +" "+ fromY +
        " L "+ (fromX+this.pathStraight) +" "+ fromY +
        " C "+ (fromX+this.pathCurve) +" "+ fromY +" "+ (toX-this.pathCurve) +" "+ toY +" "+ (toX-this.pathStraight) +" "+ toY +
        " L "+ toX +" "+ toY;
    },
    svgPathShadow: function () {
      // Same as svgPath() but y+1
      var fromX = this.positions.fromX - this.svgX();
      var fromY = this.positions.fromY - this.svgY() + 1;
      var toX = this.positions.toX - this.svgX();
      var toY = this.positions.toY - this.svgY() + 1;
      return "M "+ fromX +" "+ fromY +
        " L "+ (fromX+this.pathStraight) +" "+ fromY +
        " C "+ (fromX+this.pathCurve) +" "+ fromY +" "+ (toX-this.pathCurve) +" "+ toY +" "+ (toX-this.pathStraight) +" "+ toY +
        " L "+ toX +" "+ toY;
    },
    color: function () {
      if (this._color) {
        return this._color;
      }
      if (this.model) {
        // Connected
        this._color = Iframework.getWireColor();
        return this._color;
      } else {
        // Preview
        return Iframework.wireColors[Iframework.wireColorIndex];
      }
    },
    setColor: function(c) {
      this._color = c;
      $(this.elementWire).attr( "stroke", c );
    },
    label: function () {
      return this.model.get("source")[0] +":"+ this.model.get("source")[1] + 
        '<span class="wiresymbol" style="color:' + this._color + '">&rarr;</span>' + 
        this.model.get("target")[0] +":"+ this.model.get("target")[1];
    },
    // Thanks bobince http://stackoverflow.com/a/3642265/592125
    makeSVG: function(tag, attrs) {
      var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (var k in attrs) {
        if (k === "xlink:href") {
          // Pssh namespaces...
          el.setAttributeNS('http://www.w3.org/1999/xlink','href', attrs[k]);
        } else {
          el.setAttribute(k, attrs[k]);
        }
      }
      return el;
    },
    dim: function(){
      $(this.elementGroup).attr("opacity", 0.2);
    },
    undim: function(){
      $(this.elementGroup).attr("opacity", 1);
    },
    click: function(event) {
      // If not on top already
      if (this._z < this.model.parentGraph.edgeCount-1) {
        // Bring to top (z-order of SVG can't be done with CSS)
        this.graphSVGElement.appendChild(this.elementGroup);
        this._z = this.model.parentGraph.edgeCount++;
      }
      this.highlight();
    },
    highlight: function() {
      // Highlight edge and plugends
      var shadow = $(this.elementShadow);
      shadow.attr("class", "wire-shadow highlight");
      setTimeout(function(){
        shadow.attr("class", "wire-shadow");
      }, 1000);
      if (this.model.Source.view) {
        this.model.Source.view.highlight();
      }
      if (this.model.Target.view) {
        this.model.Target.view.highlight();
      }
    }


  });

});
