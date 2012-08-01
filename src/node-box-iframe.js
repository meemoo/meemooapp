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
      var output = this.Outputs.get(message.output);
      if (!!output) {
        output.send(message.value);
      }
    },
    recieve: function (message) {
      if (window.frames[this.frameIndex]) {
        window.frames[this.frameIndex].postMessage(message, "*");
      } else {
        console.error("wat "+this.id+" "+this.frameIndex);
      }
    },
    setState: function () {
      var state = this.get("state");
      if (state) {
        this.recieve({setState: state});
      }
    }

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
