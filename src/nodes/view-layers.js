// extends src/nodes/view.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="layers" style="z-index:1" />'+
    '<div class="info" style="position:absolute; left:0; bottom:0; z-index:2">'+
      '<div>deprecated, try image/layers instead</div>'+
      '<ul class="list" style="list-style-type:none; margin:0; padding:0;"></ul>'+
      '<button class="refresh">refresh</button>'+
    '</div>';

  Iframework.NativeNodes["view-layers"] = Iframework.NativeNodes["view"].extend({

    info: {
      title: "layers",
      description: "can get any of the canvases in the graph and make a stack of them"
    },
    template: _.template(template),
    events: {
      "change .vis": "setVis",
      "click .refresh": "refreshList",
      "sortstop .list": "sortLayers"
    },
    initializeModule: function(){
      this.mainDiv = this.$(".layers")[0];
      this.visible = {};
      // Make list
      var self = this;
      _.delay(function(){self.refreshList();}, 1000);
    },
    refreshList: function(){
      var list = this.$('.list').empty();
      // Only visible canvases
      _.each($("canvas"), function(canvas){
        // Ignore own canvases
        if (canvas.className !== "layers-copy") {
          var li = $('<li class="ui-state-default" style="padding:5px;" />')
            .text(canvas.id);
          var id = canvas.id.split("-")[1];
          var vis = $('<input type="checkbox" id="vis-'+canvas.id+'" class="vis" title="visible" />')
            .data({
              "canvas": canvas,
              "id": id
            });
          if (this.visible[id]) {
            vis.attr({
              "checked": "checked"
            });
          }
          li.append(vis);
          list.append(li);
        }
      }, this);
      list.sortable();
    },
    setVis: function(event){
      var id = $(event.target).data("id");
      if (event.target.checked) {
        // Show canvas to copy
        if (!this.visible[id]) {
          var vis = {};
          this.visible[id] = vis;
          vis.nativeView = this.model.parentGraph.get("nodes").get(id).view.Native;
          vis.original = $(event.target).data("canvas");
          vis.copy = document.createElement("canvas");
          vis.copy.width = vis.original.width;
          vis.copy.height = vis.original.height;
          vis.copy.className = "layers-copy";
          vis.copy.style.position = "absolute";
          vis.copy.style.top = 0;
          vis.copy.style.left = 0;
          vis.copy.style.width = "100%";
          vis.context = vis.copy.getContext("2d");
          vis.context.drawImage(vis.original, 0, 0);
          vis.last = vis.nativeView._lastRedraw;
          this.mainDiv.appendChild(vis.copy);
        }
      } else {
        // Kill canvas
        if (this.visible[id]) {
          this.visible[id].copy.parentNode.removeChild(this.visible[id].copy);
          this.visible[id] = null;
        }
      }
      this.sortLayers();
    },
    sortLayers: function(event, ui){
      var count = 0;
      _.each(this.$(".list .vis"), function(checkbox){
        var id = $(checkbox).data("id");
        var vis = this.visible[id];
        if (vis && vis.copy) {
          vis.copy.style.zIndex = count;
          count++;
        }
      }, this);
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
    },
    renderAnimationFrame: function (timestamp) {
      // Get a tick from GraphView.renderAnimationFrame()
      // this._valueChanged is set by NodeBox.receive()
      if (this._triggerRedraw) {
        this._triggerRedraw = false;
        this.redraw(timestamp);
        this._lastRedraw = timestamp;
      }
      for (var i in this.visible) {
        var layer = this.visible[i];
        if (layer) {
          if (layer.last !== layer.nativeView._lastRedraw) {
            layer.context.clearRect(0, 0, layer.copy.width, layer.copy.height);
            layer.context.drawImage(layer.original, 0, 0);
            layer.last = layer.nativeView._lastRedraw;
          }
        }
      }
    },
    inputs: {
    },
    outputs: {
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
