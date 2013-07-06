$(function(){

  Iframework.NodeBoxIframe = Iframework.NodeBox.extend({
    initializeView: function () {
      // Called from GraphView.addNode();
      this.view = new Iframework.NodeBoxIframeView({model:this});
      return this.view;
    },
    info: {
      title: "iframe-node",
      description: "extend me"
    },
    sendFromFrame: function (message) {
      var name = message.output;
      var value = message.value;
      // Convert pixels message to canvas
      if (Iframework.util.type(message.value) === "ImageData") {
        value = this.makeCanvas(value);
      }
      this.send(name, value);
    },
    receive: function (name, value) {
      if (this.view && this.view.iframeloaded) {
        // Convert canvas message to pixels
        if (Iframework.util.type(value) === "HTMLCanvasElement") {
          try {
            value = value.getContext("2d").getImageData(0, 0, value.width, value.height);
          } catch (e) {
            // Dirty canvas
            return false;
          }
        }
        var m = {};
        m[name] = value;
        this.view.iframe.contentWindow.postMessage(m, "*");
      } else {
        console.error("wat "+this.id+" "+this.frameIndex);
      }
    },
    setState: function () {
      var state = this.get("state");
      if (state) {
        this.receive({setState: state});
      }
    },
    iframeLoaded: function () {
      this.loaded = true;
      this.parentGraph.checkLoaded();
    },
    toString: function() {
      if (this.info) {
        return "Iframe node "+this.get("id")+": "+this.info.title;
      } else {
        return "Iframe node "+this.get("id");
      }
    },
    makeCanvas: function(imageData) {
      if (!this.canvas) {
        // Make internal canvas to pass
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext('2d');
      }
      if (this.canvas.width !== imageData.width || this.canvas.height !== imageData.height) {
        // Resize if needed
        this.canvas.width = imageData.width;
        this.canvas.height = imageData.height;
      }
      this.context.putImageData(imageData, 0, 0);
      return this.canvas;
    }

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
