// extends src/nodes/view.js which extends src/node-box-native-view.js

$(function(){

  // Returns style object with matrix3d with prefixes
  // THANK YOU MvG http://math.stackexchange.com/a/339033/78081
  var quadWarpMatrix = function(w, h, xTL, yTL, xTR, yTR, xBL, yBL, xBR, yBR) {

    function adj(m) { // Compute the adjugate of m
      return [
        m[4]*m[8]-m[5]*m[7], m[2]*m[7]-m[1]*m[8], m[1]*m[5]-m[2]*m[4],
        m[5]*m[6]-m[3]*m[8], m[0]*m[8]-m[2]*m[6], m[2]*m[3]-m[0]*m[5],
        m[3]*m[7]-m[4]*m[6], m[1]*m[6]-m[0]*m[7], m[0]*m[4]-m[1]*m[3]
      ];
    }
    function multmm(a, b) { // multiply two matrices
      var c = Array(9);
      for (var i = 0; i != 3; ++i) {
        for (var j = 0; j != 3; ++j) {
          var cij = 0;
          for (var k = 0; k != 3; ++k) {
            cij += a[3*i + k]*b[3*k + j];
          }
          c[3*i + j] = cij;
        }
      }
      return c;
    }
    function multmv(m, v) { // multiply matrix and vector
      return [
        m[0]*v[0] + m[1]*v[1] + m[2]*v[2],
        m[3]*v[0] + m[4]*v[1] + m[5]*v[2],
        m[6]*v[0] + m[7]*v[1] + m[8]*v[2]
      ];
    }
    function pdbg(m, v) {
      var r = multmv(m, v);
      return r + " (" + r[0]/r[2] + ", " + r[1]/r[2] + ")";
    }
    function basisToPoints(x1, y1, x2, y2, x3, y3, x4, y4) {
      var m = [
        x1, x2, x3,
        y1, y2, y3,
         1,  1,  1
      ];
      var v = multmv(adj(m), [x4, y4, 1]);
      return multmm(m, [
        v[0], 0, 0,
        0, v[1], 0,
        0, 0, v[2]
      ]);
    }
    function general2DProjection(
      x1s, y1s, x1d, y1d,
      x2s, y2s, x2d, y2d,
      x3s, y3s, x3d, y3d,
      x4s, y4s, x4d, y4d
    ) {
      var s = basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
      var d = basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);
      return multmm(d, adj(s));
    }
    function project(m, x, y) {
      var v = multmv(m, [x, y, 1]);
      return [v[0]/v[2], v[1]/v[2]];
    }

    function matrix3d(w, h, x1, y1, x2, y2, x3, y3, x4, y4) {
      // var w = elt.offsetWidth, h = elt.offsetHeight;
      var t = general2DProjection( 0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4 );
      for (i = 0; i != 9; ++i) t[i] = t[i]/t[8];
      t = [t[0], t[3], 0, t[6],
           t[1], t[4], 0, t[7],
           0   , 0   , 1, 0   ,
           t[2], t[5], 0, t[8]];
      t = "matrix3d(" + t.join(", ") + ")";
      return t;
    }

    function prefixTransform(val) {
      return {
        "-webkit-transform": val,
        "-moz-transform": val,
        "-o-transform": val,
        "transform": val
      };
    }

    return prefixTransform(matrix3d(w, h, xTL, yTL, xTR, yTR, xBL, yBL, xBR, yBR));

  };



  var template = 
    '<div class="layers" style="position:absolute; top:0; left:110px; bottom:0; right:0px; overflow:auto; z-index:0; background-color:black;">'+
      '<div class="canvases" style="position:absolute; top:0px; left:0px; z-index:1;" ></div>'+
      '<div class="control-points" style="position:absolute; top:0px; left:0px; z-index:2;" >'+
        '<div title="top-left"     class="control-point tl c0" data-handle="0" style="position:absolute" ></div>'+
        '<div title="top-right"    class="control-point tr c1" data-handle="1" style="position:absolute" ></div>'+
        '<div title="bottom-left"  class="control-point bl c2" data-handle="2" style="position:absolute" ></div>'+
        '<div title="bottom-right" class="control-point br c3" data-handle="3" style="position:absolute" ></div>'+
      '</div>'+
    '</div>'+
    '<div style="position:absolute; top:0; left:0; bottom:0; width:110px; overflow: auto;">'+
      '<ul class="list" style="list-style-type:none; margin:0 0 10px 0; padding:0;"></ul>'+
      '<button class="deselect button">deselect</button>'+
      // '<span class="button flatten" title="flatten image layer to one">flatten</span>'+
      '<div class="info"></div>'+
    '</div>';

  var layerTemplate = 
    '<li class="list-item" title="drag to sort, select to move">'+
      '<input class="list-item-visible" type="checkbox" title="visible" <%= visible ? "checked" : "" %> ></input>'+
      '<canvas class="list-item-preview" width="50" height="50"></canvas>'+
      '<button class="list-item-delete no-label icon-trash" title="delete layer"></button>'+
      '<span class="list-item-name"><%= name %></span>'+
      '<%= ( name==="dropped" ? \'<span class="list-item-info" title="will not save" >*</span>\' : "" ) %>'+
      '<span class="list-item-controls"><br/>'+
        // 'x: <span class="list-item-x"><%= x %></span>, y: <span class="list-item-y"><%= y %></span>'+
      '</span>'+
    '</li>';

  Iframework.NativeNodes["image-mapper"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "mapper",
      description: "make a stack of canvases"
    },
    template: _.template(template),
    layerTemplate: _.template(layerTemplate),
    events: {
      "sortstop .list":               "sortLayers",
      "click .list-item":             "selectLayer",
      "change .list-item-visible":    "setVisible",
      "mousedown .list-item-preview": "checkDirty",
      "click .list-item-delete":      "deleteLayer",
      "click .deselect":              "deselect",
      "click .control-point":         "selectPoint",
      "dragstart .control-point":     "startMove",
      "drag .control-point":          "move",
      "dragstop .control-point":      "stopMove",
      "mouseover":                    "mouseOver",
      "mouseout":                     "mouseOut",
      "click .mapper-canvas":         "selectCanvas"
    },
    initializeModule: function(){
      // Don't use default canvas
      $(this.canvas)
        .draggable("destroy")
        .remove();

      this.$(".list").sortable();

      // Set up layers from saved state
      this.layerInfo = {};
      var layers = this.model.get("state")["layers"];
      if (layers) {
        for (var i=0; i<layers.length; i++) {
          var info = _.pick(layers[i], ['name','visible','sort', 'x0','y0','x1','y1','x2','y2','x3','y3']);
          info.id = info.name;
          this.layerInfo[info.id] = info;
        }
      }

      this.$(".control-points").hide();
      this.$(".control-point").draggable();

      // Move layers
      // this.resizer = this.$(".resizer")[0];
      // this.resizerContext = this.resizer.getContext('2d');
      // this.$(".resizer").draggable({
      //   helper: function(){
      //     return $("<div>");
      //   }
      // });

      // Nudge layer
      var self = this;
      document.addEventListener("keydown", function(event){
        switch (event.keyCode) {
          case 38: // up
            self.nudgeUp(event);
            break;
          case 39: // right
            self.nudgeRight(event);
            break;
          case 40: // down
            self.nudgeDown(event);
            break;
          case 37: // left
            self.nudgeLeft(event);
            break;
          default:
            break;
        }
      });

    },
    layerInfo: {},
    inputimage: function(i){
      // Find or make layer
      var layer;
      var len = this.$('.list-item').length;
      var newLayer = false;
      if (i.id) {
        // From input, updates with input
        if (!this.layerInfo[i.id]) {
          // Add new
          this.layerInfo[i.id] = {
            id: i.id, name: i.id, visible: true, sort: len+10, 
            w: i.width, h:i.height,
            x0: 0, y0: 0,        x1: i.width, y1: 0,
            x2: 0, y2: i.height, x3: i.width, y3: i.height
          };
          newLayer = true;
        }
        layer = this.layerInfo[i.id];
      } else {
        // Dropped, does not update
        var randomId = Math.round(Math.random()*100000);
        while ( this.layerInfo[randomId] ) {
          // Make sure unique
          randomId = Math.round(Math.random()*100000);
        }
        layer = this.layerInfo[randomId] = {
          id: randomId, name:"dropped", visible: true, sort: len+10, 
          w: i.width, h: i.height,
          x0: 0, y0: 0,        x1: i.width, y1: 0, 
          x2: 0, y2: i.height, x3: i.width, y3: i.height
        };
        newLayer = true;
      }

      // Redraw on next animation frame or on show
      layer.dirty = true;

      if (!layer.canvas) {
        layer.source = i;
        layer.canvas = document.createElement("canvas");
        layer.w = layer.canvas.width = i.width;
        layer.h = layer.canvas.height = i.height;
        layer.context = layer.canvas.getContext("2d");
        $(layer.canvas)
          .addClass("mapper-canvas")
          .css({
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: layer.sort,
            "transform-origin": "0 0",
            "-webkit-transform-origin": "0 0",
            "-moz-transform-origin": "0 0",
            "-o-transform-origin": "0 0"
          })
          .data("layer", layer);
        layer.reMatrix = true;
        this.$(".canvases").append(layer.canvas);
        newLayer = true;
      }

      // Find or make list view
      var listView = layer.listView;
      if (listView) {
        layer.listViewDirty = true;
      } else {
        listView = layer.listView = $( this.layerTemplate(layer) );
        listView.data({"iframework-image-layers-layer": layer});
        var preview = layer.listViewCanvas = listView.find("canvas.list-item-preview")[0];
        Iframework.util.fitAndCopy(i, preview);
        layer.listViewDirty = false; 
        // Add to list
        this.$(".list").prepend(listView);
        // Resort
        var sorted = this.$('.list-item').sort(function(a, b){
          var aa = $(a).data("iframework-image-layers-layer").sort;
          var bb = $(b).data("iframework-image-layers-layer").sort;
          return bb-aa;
        });
        this.$(".list").append(sorted);
        // Select
        listView.click();
      }

      if (newLayer) {
        // Save new tracked layer to graph
        this.saveLayerInfo();
        this.rebuildDrawStack();
      }

      this._triggerRedraw = true;
    },
    // inputimg: function(url){
    //   var randomId = Math.round(Math.random()*100000);
    //   while ( this.layerInfo[randomId] ) {
    //     // Make sure unique
    //     randomId = Math.round(Math.random()*100000);
    //   }
    //   var img = document.createElement("img");
    //   img.onload = function (e) {
    //     layer = this.layerInfo[randomId] = {
    //       id: randomId, name: url, visible: true, sort: len+10, 
    //       w: img.width, h: img.height,
    //       x0: 0, y0: 0,          x1: img.width, y1: 0, 
    //       x2: 0, y2: img.height, x3: img.width, y3: img.height
    //     };
    //     newLayer = true;
    //   };
    //   img.src = url;
    // },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "image") {
        // Remove canvas
        // Remove list preview
        // Remove layer
      }
    },
    sortLayers: function(event, ui){
      var layers = this.$(".list-item");
      var count = layers.length;
      _.each(layers, function(item){
        var layer = $(item).data("iframework-image-layers-layer");
        layer.sort = count;
        $(layer.canvas).css("z-index", count);
        count--;
      }, this);

      this.saveLayerInfo();
      this.rebuildDrawStack();
    },
    setVisible: function (event) {
      var layer = $(event.target).parent().data("iframework-image-layers-layer");
      layer.visible = event.target.checked;

      if (layer.canvas) {
        if (layer.visible) {
          this.$(".canvases").append(layer.canvas);
        } else {
          $(layer.canvas).detach();
        }
      }

      this.saveLayerInfo();
      this.rebuildDrawStack();
    },
    saveLayerInfo: _.debounce(function () {
      // Filter only relevant layers
      var saveable = _.filter(this.layerInfo, function(item){ 
        return item.name && item.name !== "dropped"; 
      });
      // Filter relevant info
      saveable = _.map(saveable, function(value, key, list){ 
        return _.pick(value, ['name','visible','sort', 'x0','y0','x1','y1','x2','y2','x3','y3']);
      });
      // Sort
      saveable = saveable.sort(function(a, b){
        return a.sort-b.sort;
      });
      // Save to graph
      this.set("layers", saveable);

    }, 100),
    stack: [],
    rebuildDrawStack: function () {
      // Rebuild sorted stack for drawing
      var stack = [];
      for (var name in this.layerInfo) {
        var layer = this.layerInfo[name];
        if (layer.visible && layer.canvas) {
          stack.push(layer);
        }
      }
      stack = stack.sort(function(a, b){
        return (a.sort - b.sort);
      });
      this.stack = stack;

      this._triggerRedraw = true;
    },
    checkDirty: function (event) {
      // Only update previews when clicked
      var layer = $(event.target).parent().data("iframework-image-layers-layer");
      if (layer && layer.listViewDirty) {
        layer.listViewCanvas.getContext("2d").clearRect(0, 0, layer.listViewCanvas.width, layer.listViewCanvas.height);
        Iframework.util.fitAndCopy(layer.canvas, layer.listViewCanvas);
      }
    },
    deselect: function () {
      this.selected = null;
      this.$(".list-item").removeClass("selected");
      this.selectedPoint = null;
      this.$(".control-point").removeClass("selected");
      this.$(".control-points").hide();
    },
    selected: null,
    selectLayer: function (event) {
      // Deselect others
      this.$(".list-item").removeClass("selected");
      this.selectedPoint = null;
      this.$(".control-point").removeClass("selected");
      // Select this
      $(event.currentTarget).addClass("selected");
      // Only update previews when clicked
      var layer = $(event.currentTarget).data("iframework-image-layers-layer");
      if (layer) {
        // Select this
        this.selected = layer;
        // Show control corners
        this.$(".control-points").show();
        this.updateControlPoints();
      }
    },
    selectCanvas: function (event) {
      var layer = $(event.target).data("layer");
      if (layer) {
        layer.listView.click();
      }
    },
    updateControlPoints: function () {
      if (this.selected) {
        var layer = this.selected;
        this.$(".control-point.tl").css({ left: layer.x0+"px", top: layer.y0+"px" });
        this.$(".control-point.tr").css({ left: layer.x1+"px", top: layer.y1+"px" });
        this.$(".control-point.bl").css({ left: layer.x2+"px", top: layer.y2+"px" });
        this.$(".control-point.br").css({ left: layer.x3+"px", top: layer.y3+"px" });
      }
    },
    deleteLayer: function (event) {
      if (this.selected) {
        // Remove list preview
        $(this.selected.listView).remove();

        // Remove canvas
        $(this.selected.canvas).remove();

        // Remove layer
        this.layerInfo[this.selected.id] = null;
        delete this.layerInfo[this.selected.id];
        this.deselect();

        this.saveLayerInfo();
        this.rebuildDrawStack();
      }
    },
    movePoint: function (layer, point, x, y) {
      // Move one control point
      layer["x"+point] = x;
      layer["y"+point] = y;

      this.$(".control-point.c"+point).css({ left: x+"px", top: y+"px" });

      layer.reMatrix = true;

      this.saveLayerInfo();
      this._triggerRedraw = true;
    },
    selectedPoint: null,
    selectPoint: function (event) {
      if (this.selected) {
        this.$(".control-point").removeClass("selected");
        var dragger = $(event.target);
        dragger.addClass("selected");
        this.selectedPoint = dragger.data("handle");
      }
    },
    moveLayer: function (layer, x, y) {
      // Nudge all control points
      layer.x0 += x;
      layer.y0 += y;
      layer.x1 += x;
      layer.y1 += y;
      layer.x2 += x;
      layer.y2 += y;
      layer.x3 += x;
      layer.y3 += y;

      layer.reMatrix = true;

      this.saveLayerInfo();
      this._triggerRedraw = true;

      this.updateControlPoints();
    },
    // movingPointStartX: 0,
    // movingPointStartY: 0,
    startMove: function(event, ui){
      this.selectPoint(event);
    },
    move: function(event, ui){
      if (this.selected) {
        var p = $(event.target).data("handle");
        var x = ui.position.left;
        var y = ui.position.top;
        this.movePoint(this.selected, p, x, y);
      }
    },
    stopMove: function(event, ui){
    },
    _enableNudge: false,
    mouseOver: function () {
      this._enableNudge = true;
    },
    mouseOut: function () {
      this._enableNudge = false;
    },
    nudgeUp: function (event) {
      if (this._enableNudge && this.selected) {
        event.preventDefault(); // Don't scroll
        if (this.selectedPoint !== null) {
          var x = this.selected["x"+this.selectedPoint];
          var y = this.selected["y"+this.selectedPoint];
          this.movePoint(this.selected, this.selectedPoint, x, y-1);
        } else {
          this.moveLayer(this.selected, 0, 0-1);
        }
      }
    },
    nudgeDown: function (event) {
      if (this._enableNudge && this.selected) {
        event.preventDefault(); // Don't scroll
        if (this.selectedPoint !== null) {
          var x = this.selected["x"+this.selectedPoint];
          var y = this.selected["y"+this.selectedPoint];
          this.movePoint(this.selected, this.selectedPoint, x, y+1);
        } else {
          this.moveLayer(this.selected, 0, 0+1);
        }
      }
    },
    nudgeLeft: function (event) {
      if (this._enableNudge && this.selected) {
        event.preventDefault(); // Don't scroll
        if (this.selectedPoint !== null) {
          var x = this.selected["x"+this.selectedPoint];
          var y = this.selected["y"+this.selectedPoint];
          this.movePoint(this.selected, this.selectedPoint, x-1, y);
        } else {
          this.moveLayer(this.selected, 0-1, 0);
        }
      }
    },
    nudgeRight: function (event) {
      if (this._enableNudge && this.selected) {
        event.preventDefault(); // Don't scroll
        if (this.selectedPoint !== null) {
          var x = this.selected["x"+this.selectedPoint];
          var y = this.selected["y"+this.selectedPoint];
          this.movePoint(this.selected, this.selectedPoint, x+1, y);
        } else {
          this.moveLayer(this.selected, 0+1, 0);
        }
      }
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()

      // Draw stack
      var stackLength = this.stack.length;
      if (stackLength > 0) {
        for (var i=0; i<stackLength; i++) {
          var layer = this.stack[i];
          if (layer.reMatrix) {
            var matrix3d = quadWarpMatrix( layer.w, layer.h, layer.x0, layer.y0, layer.x1, layer.y1, layer.x2, layer.y2, layer.x3, layer.y3);
            // console.log( layer.w, layer.h, layer.x0, layer.y0, layer.x1, layer.y1, layer.x2, layer.y2, layer.x3, layer.y3 );
            // console.log( matrix3d.transform );
            $(layer.canvas).css(matrix3d);
            // layer.canvas.style.transform = matrix3d;
            layer.reMatrix = false;
          }
          if (layer.dirty) {
            // Resize if needed
            if (layer.canvas.width !== layer.source.width){
              layer.w = layer.canvas.width = layer.source.width;
              layer.reMatrix = true;
            }
            if (layer.canvas.height !== layer.source.height){
              layer.h = layer.canvas.height = layer.source.height;
              layer.reMatrix = true;
            }
            // Redraw canvas
            layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
            layer.context.drawImage(layer.source, 0, 0);
            layer.dirty = false;
          }
        }
      }

    },
    popout: function() {
      if (this.w) {
        // Toggle
        this.popin();
        return false;
      }

      // Open new window to about:blank
      this.w = window.open("", "meemooRemoteWindow", "menubar=no,location=no,resizable=yes,scrollbars=no,status=no");
      var self = this;
      this.w.addEventListener("unload", function(){
        self.popin();
      });

      // Popin other
      if (Iframework.popoutModule && Iframework.popoutModule !== this) {
        Iframework.popoutModule.popin();
      }
      Iframework.popoutModule = this;
      this.w.document.body.innerHTML = "";

      // Window styling
      this.w.document.body.style.backgroundColor="black";
      this.w.document.body.style.overflow = "hidden";
      this.w.document.body.style.margin="0px";
      this.w.document.body.style.padding="0px";
      this.w.document.title = "meemoo.org";

      // Move element
      this.mainElement = this.$(".canvases")[0];
      this.w.document.body.appendChild( this.mainElement );

      return false;
    },
    popin: function() {
      if (this.w) {
        this.w = null;
      }
      // Replace element
      this.$(".layers").prepend(this.mainElement);
      return false;
    },
    inputs: {
      image: {
        type: "image",
        description: "all of the images that go into the layers"
      }
      // url: {
      //   type: "string",
      //   description: "(experimental) hotlink image url"
      // }
    },
    outputs:{}
  });


});
