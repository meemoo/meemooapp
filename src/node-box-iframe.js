$(function(){

  Iframework.NodeBoxIframe = Iframework.NodeBox.extend({
    loaded: false,
    defaults: function() {
      return {
        src: "",
        x: 100,
        y: 400,
        z: 0,
        w: 200,
        h: 200,
        state: {}
      }
    },
    initialize: function () {
      this.Inputs = new Iframework.Ports();
      this.Outputs = new Iframework.Ports();

      // Change event
      this.on("change", this.nodeChanged);
    },
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
    },
    addInput: function (info) {
      // Name must be unique
      var replace = this.Inputs.findByName(info.name);
      if (replace) {
        return;
      }
      var newPort = new Iframework.Port(info);
      newPort.isIn = true;
      newPort.node = this;
      newPort.graph = this.graph;
      this.Inputs.add(newPort);
      if (this.view) {
        this.view.addInput(newPort);
      }
      // Set state to post defaults
      var currentState = this.get("state");
      if ( info.hasOwnProperty("default") && info.default != "" && !currentState.hasOwnProperty(info.name) ) {
        currentState[info.name] = info.default;
      }
    },
    addOutput: function (info) {
      // Name must be unique
      var replace = this.Outputs.findByName(info.name);
      if (replace) {
        return;
      }
      var newPort = new Iframework.Port(info);
      newPort.isIn = false;
      newPort.node = this;
      newPort.graph = this.graph;
      this.Outputs.add(newPort);
      if (this.view) {
        this.view.addOutput(newPort);
      }
    },
    nodeChanged: function () {
      if (this.graph) {
        this.graph.trigger("change");
      }
    },
    remove: function () {
      this.graph.removeNode(this);
    }

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
