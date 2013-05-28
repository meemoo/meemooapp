// extends src/nodes/view.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="layers" style="position:absolute; top:0; left:110px; bottom:0; right:0px; overflow: auto; z-index:0;">'+
      '<canvas class="resizer" style="position:absolute; top:0px; left:0px; z-index:2;" width="500" height="500" ></canvas>'+
    '</div>'+
    '<div style="position:absolute; top:0; left:0; bottom:0; width:110px; overflow: auto;">'+
      '<ul class="list" style="list-style-type:none; margin:0 0 10px 0; padding:0;"></ul>'+
      '<span class="drag-flat canvas button icon-picture" title="drag flattened image">drag image</span>'+
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
        'alpha: <input class="list-item-alpha" type="number" value="<%= alpha %>" min="0" max="1" style="width:40px;"></input>,<br />'+
        'x: <span class="list-item-x"><%= x %></span>, y: <span class="list-item-y"><%= y %></span> '+
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
      "sortstop .list":     "sortLayers",
      "click .list-item":   "selectLayer",
      "focus .list-item-visible": "focusLayer",
      "change .list-item-visible": "setVisible",
      "focus .list-item-alpha": "disableNudge",
      "click .list-item-alpha": "disableNudge",
      "change .list-item-alpha": "setAlpha",
      "mousedown .list-item-preview": "checkDirty",
      "click .list-item-delete": "deleteLayer",
      "click .drag-flat":   "deselect",
      "dragstart .resizer": "startMove",
      "drag .resizer":      "move",
      "dragstop .resizer":  "stopMove",
      "mouseover":          "enableNudge",
      "mouseout":           "disableNudge"
    },
    initializeModule: function(){
      // Move default canvas
      this.$(".layers").prepend(this.canvas);
      $(this.canvas)
        // .draggable("destroy")
        .css("maxWidth", "none");

      this.$(".list").sortable();

      // Set up layers from saved state
      this.layerInfo = {};
      var layers = this.model.get("state")["layers"];
      if (layers) {
        for (var i=0; i<layers.length; i++) {
          var info = _.pick(layers[i], ['name', 'visible', 'sort', 'x', 'y', 'alpha']);
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
          this.layerInfo[i.id] = {id: i.id, name: i.id, visible: true, sort: len+10, x:0, y:0, alpha:1};
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
        layer = this.layerInfo[randomId] = {id: randomId, name:"dropped", visible: true, sort: len+10, x:0, y:0, alpha:1};
        newLayer = true;
      }

      // Find or make list view
      var listView = layer.listView;
      if (listView) {
        layer.listViewDirty = true;
      } else {
        // Defaults
        if (layer.x === undefined) { layer.x = 0; }
        if (layer.y === undefined) { layer.x = 0; }
        if (layer.alpha === undefined) { layer.alpha = 1; }
        // Make list item
        listView = layer.listView = $( this.layerTemplate(layer) );
        listView.data({"iframework-image-layers-layer": layer});
        var preview = layer.listViewCanvas = listView.find("canvas.list-item-preview")[0];
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    focusLayer: function (event) {
      // Select layer when tab to visible checkbox
      $(event.target).parent().click();
    },
    setVisible: function (event) {
      var layer = $(event.target).parent().data("iframework-image-layers-layer");
      layer.visible = event.target.checked;

      this.saveLayerInfo();
      this.rebuildDrawStack();
    },
    setAlpha: function (event) {
      var layer = $(event.target).parent().parent().data("iframework-image-layers-layer");
      layer.alpha = parseFloat( event.target.value );

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
        return _.pick(value, ['name', 'visible', 'sort', 'x', 'y', 'alpha']);
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
      $(".resizer").hide();
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
        $(".resizer").show();
      }
      this.enableNudge();
    },
    deleteLayer: function (event) {
      if (this.selected) {
        // Remove list preview
        $(this.selected.listView).remove();
        // Remove layer
        this.layerInfo[this.selected.id] = null;
        delete this.layerInfo[this.selected.id];
        this.deselect();

        this.saveLayerInfo();
        this.rebuildDrawStack();
      }
    },
    moveLayer: function (layer, x, y) {
      if (this._tile) {
        while (x < 0-this._w){
          x += this._w;
        }
        while (x > this._w){
          x -= this._w;
        }
        while (y < 0-this._h){
          y += this._h;
        }
        while (y > this._h){
          y -= this._h;
        }
      }
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
    enableNudge: function () {
      this._enableNudge = true;
    },
    disableNudge: function (event) {
      if (event) {
        event.stopPropagation();
      }
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

          // Layer alpha
          this.context.globalAlpha = layer.alpha;

          // Draw layer
          if (this._tile) {
            // Draw enough times to make it tile
            var x = layer.x;
            while (x<this._w) {
              x += this._w;
            }
            var y = layer.y;
            while (y<this._h) {
              y += this._h;
            }
            var yStart = y;

            while (x > 0-layer.canvas.width) {
              while (y > 0-layer.canvas.height) {
                if (x<this._w && x>0-layer.canvas.width && y<this._h && y>0-layer.canvas.height ) {
                  this.context.drawImage(layer.canvas, x, y);
                }
                y -= this._h;
              }
              x -= this._w;
              y = yStart;
            }
          } else {
            // Draw one layer
            this.context.drawImage(layer.canvas, layer.x, layer.y);
          }

          // Reset alpha
          this.context.globalAlpha = 1;

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
