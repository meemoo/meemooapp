$(function(){

  Iframework.NodeBoxIframe = Iframework.NodeBox.extend({
    initializeView: function () {
      // Called from GraphView.addNode();
      this.view = new Iframework.NodeBoxIframeView({model:this});
      return this.view;
    },
    // send: function (message) {
    //   // Send to connected ports
    // },
    sendFromFrame: function (message) {
      this.Outputs.get(message.output).send(message.value);
    },
    recieve: function (message) {
      if (window.frames[this.frameIndex]) {
        window.frames[this.frameIndex].postMessage(message, "*");
      } else {
        console.error("wat "+this.id+" "+this.frameIndex);
      }
    },
    setState: function (state) {
      this.recieve({setState: state});
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
