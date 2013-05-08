// extends src/nodes/view.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="layers" style="position:absolute; top:0; left:100px; bottom:0; right:0px; overflow: auto; z-index:0;">'+
      '<canvas class="resizer" style="position: absolute; top: 0px; left: 0px; z-index: 10;" ></canvas>'+
    '</div>'+
    '<div class="info" style="position:absolute; top:0; left:0; bottom:0; width:100px; overflow: auto;">'+
      '<ul class="list" style="list-style-type:none; margin:0 0 5px 0; padding:0;"></ul>'+
      '<button class="send" title="send flattened image">send</button>'+
    '</div>';

  var layerTemplate = 
    '<li class="list-item" title="drag to sort, select to move">'+
      '<input type="checkbox" class="visible" title="visible" <%= visible ? "checked" : "" %> ></input> '+
      '<canvas class="preview" width="50" height="50" style="background-image:url(img/alphabg.png)"></canvas> '+
      '<span class="list-item-name"><%= name %></span>'+
      '<%= name==="dropped" ? \'<span class="list-item-info" style="color:red;" title="will not save" >*</span>\' : "" %>'+
    '</li>';

  Iframework.NativeNodes["image-layers"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "layers",
      description: "make a stack of canvases"
    },
    template: _.template(template),
    layerTemplate: _.template(layerTemplate),
    events: {
      "click .send":        "inputsend",
      "change .visible":    "setVisible",
      "sortstop .list":     "sortLayers",
      "mousedown .preview": "checkDirty",
      "click .list-item":   "selectLayer",
      "dragstart .resizer": "startMove",
      "drag .resizer":      "move",
      "dragstop .resizer":  "stopMove"
    },
    initializeModule: function(){
      this.$(".list").sortable();
      this.mainDiv = this.$(".layers")[0];

      // Set up layers from saved state
      this.layerInfo = {};
      var layers = this.model.get("state")["layers"];
      if (layers) {
        for (var i=0; i<layers.length; i++) {
          var info = _.pick(layers[i], ['name', 'visible', 'sort', 'x', 'y']);
          info.id = info.name;
          this.layerInfo[info.id] = info;
        }
      }

      this.resizer = this.$(".resizer")[0];
      this.resizerContext = this.resizer.getContext('2d');
      this.$(".resizer").draggable({
        helper: function(){
          return $("<div>");
        }
      });
    },
    layerInfo: {},
    inputsend: function(){
      var flat = this.flatten();
      if (flat) {
        this.send("image", flat);
      }
    },
    flatten: function(){
      var layers = this.layerInfo;
      var w = 0;
      var h = 0;
      var stack = [];
      for (var name in layers) {
        var layer = layers[name];
        if (layer.visible) {
          stack.push(layer);
          if (w<layer.canvas.width) {
            w = layer.canvas.width;
          }
          if (h<layer.canvas.height) {
            h = layer.canvas.height;
          }
        }
      }
      stack = stack.sort(function(a, b){
        return (a.sort - b.sort);
      });
      if (w > 0 && h > 0) {
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var context = canvas.getContext("2d");
        for (var i=0; i<stack.length; i++) {
          context.drawImage(stack[i].canvas, stack[i].x, stack[i].y);
        }
        return canvas;
      }
      return false;
    },
    inputimage: function(i){
      // Find or make layer
      var layer;
      var len = this.$('.list-item').length;
      var newLayer = false;
      if (i.id) {
        // From input, updates with input
        if (!this.layerInfo[i.id]) {
          // Add new
          this.layerInfo[i.id] = {id: i.id, name: i.id, visible: true, sort: len, x:0, y:0};
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
        layer = this.layerInfo[randomId] = {id: randomId, name:"dropped", visible: true, sort: len, x:0, y:0};
      }

      // Reference original canvas
      layer.source = i;

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
        // if (layer.sort!==len) {
          // Resort
          var sorted = this.$('.list-item').sort(function(a, b){
            var aa = $(a).data("iframework-image-layers-layer").sort;
            var bb = $(b).data("iframework-image-layers-layer").sort;
            return bb-aa;
          });
          this.$(".list").append(sorted);
        // }
      }

      // Find or make canvas
      var canvas = layer.canvas;
      var context = layer.context;
      if (!canvas) {
        layer.canvas = document.createElement("canvas");
        canvas = layer.canvas;
        canvas.width = i.width;
        canvas.height = i.height;
        layer.context = canvas.getContext('2d');
        context = layer.context;

        // Canvas layout
        $(canvas).css({
          position: "absolute", 
          left:     layer.x ? layer.x : 0,
          top:      layer.y ? layer.y : 0, 
          zIndex:   layer.sort,
          display:  layer.visible ? "block" : "none"
        });

        // Add canvas to view
        this.$(".layers").append(canvas);
      }

      // Resize if needed
      if (canvas.width !== i.width || canvas.height !== i.height) {
        canvas.width = i.width;
        canvas.height = i.height;
      }

      // Resize widget canvas
      if (this.resizer.width < i.width){
        this.resizer.width = i.width;
      }
      if (this.resizer.height < i.height){
        this.resizer.height = i.height;
      }

      // Draw image
      if (layer.visible) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(i, 0, 0);
      } else {
        // Draw it later if/when made visible
        layer.canvasDirty = true;
      }

      if (newLayer) {
        // Save new tracked layer to graph
        this.saveLayerInfo();
      }

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
        var canvas = layer.canvas;
        canvas.style.zIndex = layer.sort = count;
        count--;
      }, this);

      // Move draggable to top
      this.$(".resizer").css("zIndex", layers.length+1);

      this.saveLayerInfo();
    },
    setVisible: function (event) {
      var layer = $(event.target).parent().data("iframework-image-layers-layer");
      layer.visible = event.target.checked;

      // Update if dirty
      if (layer.visible && layer.canvasDirty) {
        layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        layer.context.drawImage(layer.source, 0, 0);
      }

      // Show/hide
      layer.canvas.style.display = layer.visible ? "block" : "none";

      this.saveLayerInfo();
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
    checkDirty: function(event){
      // Only update previews when clicked
      var layer = $(event.target).parent().data("iframework-image-layers-layer");
      if (layer && layer.listViewDirty) {
        Iframework.util.fitAndCopy(layer.source, layer.listViewCanvas);
      }
    },
    selectLayer: function(event){
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
        $(this.selected.canvas).css({
          left: (this.startX+ui.position.left)+"px",
          top: (this.startY+ui.position.top)+"px"
        });
      }
    },
    stopMove: function(event, ui){
      if (this.selected) {
        this.selected.x = this.startX+ui.position.left;
        this.selected.y = this.startY+ui.position.top;
      }
      this.saveLayerInfo();
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
    },
    inputs: {
      image: {
        type: "image",
        description: "all of the images that go into the layers"
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

      // Style
      this.w.document.body.style.backgroundColor = "black";
      this.w.document.body.style.overflow = "hidden";
      this.w.document.title = "meemoo.org";

      // Empty it
      var el = this.w.document.body;
      while (el.hasChildNodes()){
        el.removeChild(el.lastChild);
      }

      this.mainDiv.parentNode.removeChild(this.mainDiv);
      this.w.document.body.appendChild(this.mainDiv);

      return false;
    },
    popin: function() {
      if (this.w) {
        this.w = null;
      }

      this.$el.prepend(this.mainDiv);
      
      return false;
    }
  });


});
