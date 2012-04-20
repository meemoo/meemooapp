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
      this.graphSVGElement = document.getElementById('edgesSvg');
      this.positions = {};
      if (!this.model) {
        this.isPreview = true;
      }
      if (this.model && this.model._color) {
        this._color = this.model._color;
      }
      this.render();

      if (this.model) {
        // Used to know which wire is on top when pulling from plugend
        this._z = this.model.graph.edgeCount++;

        $(this.elementWire)
          .data({
            "model": this.model
          })
          .click( function(event){
            $(event.target).data("model").view.click(event);
          });
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
        this.model.source.view.$(".plugend").show();
        this.model.target.view.$(".plugend").show();
      }

      return this;
    },
    redraw: function () {
      this.calcPositions();
      $(this.elementGroup).attr( "transform", "translate("+this.svgX()+", "+this.svgY()+")" );
      $(this.elementWire).attr( "d", this.svgPath() );
      $(this.elementShadow).attr( "d", this.svgPathShadow() );
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
        this.positions.fromX = this.model.source.view.portOffsetLeft('out', sourceName);
        this.positions.fromY = this.model.source.view.portOffsetTop('out', sourceName);
        this.positions.toX = this.model.target.view.portOffsetLeft('in', targetName);
        this.positions.toY = this.model.target.view.portOffsetTop('in', targetName);
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
        return this._color = Iframework.getWireColor();
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
      if (this._z < this.model.graph.edgeCount-1) {
        // Bring to top (z-order of SVG can't be done with CSS)
        this.graphSVGElement.appendChild(this.elementGroup);
        this._z = this.model.graph.edgeCount++;
      }
      // Highlight edge and plugends
      var shadow = $(this.elementShadow);
      shadow.attr("class", "wire-shadow highlight");
      setTimeout(function(){
        shadow.attr("class", "wire-shadow");
      }, 500);
    }


  });

});
