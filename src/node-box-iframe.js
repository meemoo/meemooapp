$(function(){

  Iframework.NodeBoxIframe = Iframework.NodeBox.extend({
    initializeView: function () {
      // Called from GraphView.addNode();
      this.view = new Iframework.NodeBoxIframeView({model:this});
      return this.view;
    },
    send: function (message) {
      if (window.frames[this.frameIndex]) {
        window.frames[this.frameIndex].postMessage(message, "*");
      } else {
        console.error("wat "+this.id+" "+this.frameIndex);
      }
    },
    recieve: function (message) {
      this.send(message);
    },
    Info: {},
    infoLoaded: function (info) {
      if (this.view) {
        this.Info = info;
        this.view.infoLoaded(info);
      }
    },
    setState: function (state) {
      this.send({setState: state});
    },
    stateReady: function () {
      // Set state
      if (this.get("state")) {
        this.setState(this.get("state"));
      }
      this.loaded = true;
      // Check if all modules are loaded
      this.graph.checkLoaded();
    }

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
