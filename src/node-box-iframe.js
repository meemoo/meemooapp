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
      var output = this.Outputs.get(message.output);
      if (!!output) {
        output.send(message.value);
      }
    },
    receive: function (message) {
      if (window.frames[this.frameIndex]) {
        window.frames[this.frameIndex].postMessage(message, "*");
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
