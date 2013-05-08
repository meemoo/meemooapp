// extends src/nodes/view.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="layers" style="position:absolute; top:0; left:100px; bottom:0; right:0px; overflow: auto; z-index:0;">'+
      '<canvas class="resizer"></canvas>'+
    '</div>'+
    '<div class="info" style="position:absolute; top:0; left:0; bottom:0; width:100px; overflow: auto;">'+
      '<ul class="list" style="list-style-type:none; margin:0; padding:0;"></ul>'+
    '</div>';

  var layerTemplate = 
    '<li class="list-item" style="border-bottom: 1px #AAA dotted; margin-bottom: 4px;">'+
      '<input type="checkbox" class="visible" <%= visible ? "checked" : "" %> ></input> '+
      '<canvas class="preview" width="50" height="50" style="background-image:url(img/alphabg.png)"></canvas> '+
      '<span class="list-item-name"><%= name %></span>'+
      '<span class="list-item-info" style="color:red;" ><%= name==="dropped" ? "*" : "" %></span>'+
    '</li>';

  Iframework.NativeNodes["image-layers"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "layers",
      description: "can get any of the canvases in the graph and make a stack of them"
    },
    template: _.template(template),
    layerTemplate: _.template(layerTemplate),
    events: {
      "change .visible":      "setVisible",
      "sortstop .list":       "sortLayers",
      "mousedown .list-item": "checkDirty"
    },
    initializeModule: function(){
      this.$(".list").sortable();
      this.mainDiv = this.$(".layers")[0];

      // Set up layers from saved state
      this.layerInfo = {};
      var layers = this.model.get("state")["layers"];
      for (var i=0; i<layers.length; i++) {
        layers[i].id = layers[i].name;
        this.layerInfo[layers[i].id] = layers[i];
      }
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
          context.drawImage(stack[i].canvas, 0, 0);
        }
        return canvas;
      }
      return false;
    },
    inputimage: function(i){
      // Find or make layer
      var layer, sort;
      if (i.id) {
        // From input, updates with input
        if (!this.layerInfo[i.id]) {
          // Add new
          sort = this.$('.list-item').length;
          this.layerInfo[i.id] = {id: i.id, name:i.id, visible: true, sort: sort};
        }
        layer = this.layerInfo[i.id];
      } else {
        // Dropped, does not update
        var randomId = Math.round(Math.random()*100000);
        while ( this.layerInfo[randomId] ) {
          // Make sure unique
          randomId = Math.round(Math.random()*100000);
        }
        sort = this.$('.list-item').length;
        layer = this.layerInfo[randomId] = {id: randomId, name:"dropped", visible: true, sort: sort};
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
      }

      // Find or make canvas
      var canvas = layer.canvas;
      var context = layer.context;
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.width = i.width;
        canvas.height = i.height;
        layer.canvas = canvas;
        context = layer.context = canvas.getContext('2d');

        // Canvas layout
        $(canvas).css({
          position:"absolute", 
          top: 0, 
          left: 0,
          zIndex: layer.sort,
          display: layer.visible ? "block" : "none"
        });

        // Add canvas to view
        this.$(".layers").append(canvas);
      }

      // Resize if needed
      if (canvas.width !== i.width || canvas.height !== i.height) {
        canvas.width = i.width;
        canvas.height = i.height;
      }

      // Draw image
      if (layer.visible) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(i, 0, 0);
      } else {
        // Draw it later if/when made visible
        layer.canvasDirty = true;
      }

      this.saveLayerInfo();
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
        return item.name !== "dropped"; 
      });
      // Filter relevant info
      saveable = _.map(saveable, function(value, key, list){ 
        return _.pick(value, 'name', 'visible', 'sort');
      });
      // Save to graph
      this.set("layers", saveable);
    }, 100),
    checkDirty: function(event){
      // Only update previews when clicked
      var layer = $(event.currentTarget).data("iframework-image-layers-layer");
      if (layer && layer.listViewDirty) {
        Iframework.util.fitAndCopy(layer.source, layer.listViewCanvas);
      }
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
