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
      this.send(message.output, message.value);
    },
    receive: function (name, message) {
      if (this.view && this.view.iframeloaded) {
        var m = {};
        m[name] = message;
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
      this.graph.checkLoaded();
    },
    toString: function() {
      if (!!this.info) {
        return "Iframe node "+this.get("id")+": "+this.info.title;
      } else {
        return "Iframe node "+this.get("id");
      }
    }

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
