// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="layers" style="z-index:1" />'+
    '<div class="info" style="position:absolute; left:0; bottom:0; z-index:2" />';

  Iframework.NativeNodes["view-layers"] = Iframework.NativeNodes["view"].extend({

    info: {
      title: "layers",
      description: "can get any of the canvases in the graph and make a stack of them"
    },
    template: _.template(template),
    events: {
      "change .vis": "setVis"
    },
    initializeModule: function(){
      // Hide old
      $(this.canvas).hide();
      // Make list
      var list = $('<ul class="list" style="list-style-type:none; margin:0; padding:0;"></ul>');
      $("canvas").each(function(i, canvas){
        var li = $('<li class="ui-state-default" style="padding:5px;" />')
          .text(canvas.id);
        var vis = $('<input type="checkbox" id="vis-'+canvas.id+'" class="vis" title="visible" />')
          .data({
            "canvas": canvas,
            "id": canvas.id.split("-")[1]
          });
        li.append(vis);
        list.append(li);
      });
      list.sortable();
      this.$(".info").html(list);
    },
    setVis: function(event){
      if (!this.visible) {
        this.visible = {};
      }
      var id = $(event.target).data("id");
      if (event.target.checked) {
        // Show canvas to copy
        if (!this.visible[id]) {
          var vis = {};
          this.visible[id] = vis;
          vis.nativeView = this.model.graph.get("nodes").get(id).view.Native;
          vis.original = $(event.target).data("canvas");
          vis.copy = document.createElement("canvas");
          vis.copy.width = vis.original.width;
          vis.copy.height = vis.original.height;
          vis.copy.style.position = "absolute";
          vis.copy.style.top = 0;
          vis.copy.style.left = 0;
          vis.context = vis.copy.getContext("2d");
          vis.context.drawImage(vis.original, 0, 0);
          vis.last = vis.nativeView._lastRedraw;
          this.$(".layers").append(vis.copy);
        }
      } else {
        // Kill canvas
        if (this.visible[id]) {
          this.$(this.visible[id].copy).remove();
          this.visible[id] = null;
        }
      }
      console.log(this.visible);
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
            layer.context.drawImage(layer.original, 0, 0);
            layer.last = layer.nativeView._lastRedraw;
          }
        }
      }
    },
    inputs: {
    },
    outputs: {
    }

  });


});
