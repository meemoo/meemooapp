// extends src/nodes/view.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="layers" style="position:absolute; top:0; left:100px; bottom:0; right:0px; overflow: auto; z-index:0;">'+
      '<div class="canvases" style="position:absolute; top:0; left:0px; width:500px; height:500px; overflow: hidden; z-index:1;"></div>'+
      '<canvas class="resizer" style="position: absolute; top: 0px; left: 0px; z-index: 2;" width="500" height="500" ></canvas>'+
    '</div>'+
    '<div class="info" style="position:absolute; top:0; left:0; bottom:0; width:100px; overflow: auto;">'+
      '<ul class="list" style="list-style-type:none; margin:0 0 5px 0; padding:0;"></ul>'+
      // '<button class="send" title="send flattened image">send</button>'+
      '<span class="button drag-flat canvas" title="drag flattened image">drag</span>'+
      // '<span class="button flatten" title="flatten image layer to one">flatten</span>'+
    '</div>';

  var layerTemplate = 
    '<li class="list-item" title="drag to sort, select to move">'+
      '<input type="checkbox" class="visible" title="visible" <%= visible ? "checked" : "" %> ></input> '+
      '<canvas class="preview" width="50" height="50" style="background-image:url(img/alphabg.png)"></canvas> '+
      '<span class="list-item-name"><%= name %></span>'+
      '<%= ( name==="dropped" ? \'<span class="list-item-info" style="color:red;" title="will not save" >*</span>\' : "" ) %>'+
      '<span class="list-item-controls">'+
        'x: <span class="list-item-x"><%= x %></span>, y: <span class="list-item-y"><%= y %></span>'+
        '<button class="list-item-delete icon-trash">delete</button>'+
      '</span>'+
    '</li>';

  Iframework.NativeNodes["image-layers"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "layers",
      description: "make a stack of canvases"
    },
    template: _.template(template),
    layerTemplate: _.template(layerTemplate),
    events: {
      // "click .send":        "inputsend",
      "change .visible":    "setVisible",
      "sortstop .list":     "sortLayers",
      "mousedown .preview": "checkDirty",
      // "click .flatten":     "flatten",
      "click .list-item":   "selectLayer",
      "click .list-item-delete": "deleteLayer",
      "dragstart .resizer": "startMove",
      "drag .resizer":      "move",
      "dragstop .resizer":  "stopMove",
      "mouseover":          "mouseOver",
      "mouseout":           "mouseOut"
    },
    initializeModule: function(){
      // Move default canvas
      this.$(".layers").prepend(this.canvas);
      $(this.canvas)
        .draggable("destroy")
        .css("maxWidth", "none");

      this.$(".list").sortable();

      // Set up layers from saved state
      this.layerInfo = {};
      var layers = this.model.get("state")["layers"];
      if (layers) {
        for (var i=0; i<layers.length; i++) {
          var info = _.pick(layers[i], ['name', 'visible', 'sort', 'x', 'y']);
          info.id = info.name;
          info.x = info.x ? info.x : 0;
          info.y = info.y ? info.y : 0;
          this.layerInfo[info.id] = info;
        }
      }

      // Move layers
      this.resizer = this.$(".resizer")[0];
      this.resizerContext = this.resizer.getContext('2d');
      this.$(".resizer").draggable({
        helper: function(){
          return $("<div>");
        }
      });

      // Drag canvas
      var self = this;
      this.$(".drag-flat").draggable({
        cursor: "pointer",
        cursorAt: { top: -10, left: -10 },
        helper: function( event ) {
          var helper = $( '<div class="drag-image"><h2>Copy this</h2></div>' )
            .data({
              "meemoo-drag-type": "canvas",
              "meemoo-source-node": self
            });
          $(document.body).append(helper);
          _.delay(function(){
            self.dragCopyCanvas(helper);
          }, 100);
          return helper;
        }
      });

      // Nudge layer
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
    inputsend: function(){
      this.send("image", this.canvas);
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
          this.layerInfo[i.id] = {id: i.id, name: i.id, visible: true, sort: len+10, x:0, y:0};
          newLayer = true;
        }
        layer = this.layerInfo[i.id];
        if (!layer.canvas) {
          newLayer = true;
        }
      } else {
        // Dropped, does not update
        var randomId = Math.round(Math.random()*100000);
        while ( this.layerInfo[randomId] ) {
          // Make sure unique
          randomId = Math.round(Math.random()*100000);
        }
        layer = this.layerInfo[randomId] = {id: randomId, name:"dropped", visible: true, sort: len+10, x:0, y:0};
        newLayer = true;
      }

      // Find or make list view
      var listView = layer.listView;
      if (listView) {
        layer.listViewDirty = true;
      } else {
        listView = layer.listView = $( this.layerTemplate(layer) );
        listView.data({"iframework-image-layers-layer": layer});
        var preview = layer.listViewCanvas = listView.find("canvas.preview")[0];
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

      // Reference canvas
      layer.canvas = i;

      if (newLayer) {
        // Save new tracked layer to graph
        this.saveLayerInfo();
        this.rebuildDrawStack();
      }

      this._triggerRedraw = true;
    },
    inputwidth: function (w) {
      this._w = w;
      this.resizer.width = w;
      this.$(".canvases").css("width", w);
      this._triggerRedraw = true;
    },
    inputheight: function (h) {
      this._h = h;
      this.resizer.height = h;
      this.$(".canvases").css("height", h);
      this._triggerRedraw = true;
    },
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
        count--;
      }, this);

      this.saveLayerInfo();
      this.rebuildDrawStack();
    },
    setVisible: function (event) {
      var layer = $(event.target).parent().data("iframework-image-layers-layer");
      layer.visible = event.target.checked;

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
        return _.pick(value, ['name', 'visible', 'sort', 'x', 'y']);
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
        Iframework.util.fitAndCopy(layer.canvas, layer.listViewCanvas);
      }
    },
    selectLayer: function (event) {
      // Deselect others
      this.$(".list-item").removeClass("selected");
      // Select this
      $(event.currentTarget).addClass("selected");
      // Only update previews when clicked
      var layer = $(event.currentTarget).data("iframework-image-layers-layer");
      if (layer) {
        // Select this
        this.selected = layer;
      }
    },
    deleteLayer: function (event) {
      if (this.selected) {
        // Remove list preview
        $(this.selected.listView).remove();
        // Remove layer
        this.layerInfo[this.selected.id] = null;
        delete this.layerInfo[this.selected.id];
        this.selected = null;

        this.saveLayerInfo();
        this.rebuildDrawStack();
      }
    },
    moveLayer: function (layer, x, y) {
      $(layer.canvas).css({
        left: x+"px",
        top: y+"px"
      });
      layer.x = x;
      layer.y = y;
      layer.listView.find(".list-item-x").text( x );
      layer.listView.find(".list-item-y").text( y );

      this.saveLayerInfo();
      this._triggerRedraw = true;
    },
    startX: 0,
    startY: 0,
    startMove: function(event, ui){
      if (this.selected) {
        this.startX = this.selected.x;
        this.startY = this.selected.y;
      }
    },
    move: function(event, ui){
      if (this.selected) {
        var x = this.startX+ui.position.left;
        var y = this.startY+ui.position.top;
        this.moveLayer(this.selected, x, y);
      }
    },
    stopMove: function(event, ui){
      if (this.selected) {
        this.move(event, ui);
      }
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
        this.moveLayer(this.selected, this.selected.x, this.selected.y-1);
      }
    },
    nudgeDown: function (event) {
      if (this._enableNudge && this.selected) {
        event.preventDefault(); // Don't scroll
        this.moveLayer(this.selected, this.selected.x, this.selected.y+1);
      }
    },
    nudgeLeft: function (event) {
      if (this._enableNudge && this.selected) {
        event.preventDefault(); // Don't scroll
        this.moveLayer(this.selected, this.selected.x-1, this.selected.y);
      }
    },
    nudgeRight: function (event) {
      if (this._enableNudge && this.selected) {
        event.preventDefault(); // Don't scroll
        this.moveLayer(this.selected, this.selected.x+1, this.selected.y);
      }
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()

      // Resize if needed
      if (this.canvas.width !== this._w || this.canvas.height !== this._h) {
        this.canvas.width = this._w;
        this.canvas.height = this._h;
      }

      // Clear
      this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

      // Draw stack
      var stackLength = this.stack.length;
      if (stackLength > 0) {
        for (var i=0; i<stackLength; i++) {
          var layer = this.stack[i];
          this.context.drawImage(layer.canvas, layer.x, layer.y);

          if (this._tile) {
            var top, right, bottom, left;
            if (layer.x < 0) {
              this.context.drawImage(layer.canvas, this.canvas.width+layer.x, layer.y);
              left = true;
            }
            if (layer.x > this.canvas.width-layer.canvas.width) {
              this.context.drawImage(layer.canvas, 0-(this.canvas.width-layer.x), layer.y);
              right = true;
            }
            if (layer.y < 0) {
              this.context.drawImage(layer.canvas, layer.x, this.canvas.height+layer.y);
              top = true;
            }
            // HACK There may be a nicer way
            if (layer.y > this.canvas.height-layer.canvas.height) {
              this.context.drawImage(layer.canvas, layer.x, 0-(this.canvas.height-layer.y));
              bottom = true;
            }
            if (left && top) {
              this.context.drawImage(layer.canvas, this.canvas.width+layer.x, this.canvas.height+layer.y);
            }
            if (right && bottom) {
              this.context.drawImage(layer.canvas, 0-(this.canvas.width-layer.x), 0-(this.canvas.height-layer.y));
            } 
            if (right && top) {
              this.context.drawImage(layer.canvas, 0-(this.canvas.width-layer.x), this.canvas.height+layer.y);
            } 
            if (left && bottom) {
              this.context.drawImage(layer.canvas, this.canvas.width+layer.x, 0-(this.canvas.height-layer.y));
            }
          }
        }
      }

      this.inputsend();

    },
    inputs: {
      image: {
        type: "image",
        description: "all of the images that go into the layers"
      },
      width: {
        type: "int",
        description: "exported image width",
        min: 1,
        max: 6826,
        "default": 500
      },
      height: {
        type: "int",
        description: "exported image height",
        min: 1,
        max: 6826,
        "default": 500
      },
      tile: {
        type: "boolean",
        description: "tile for wallpaper or textile printing",
        "default": false
      },
      send: {
        type: "bang",
        description: "send flattened image"
      }
    },
    outputs: {
      image: {
        type: "image",
        description: "flattened image"
      }
    }
  });


});
