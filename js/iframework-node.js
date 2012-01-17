$(function(){

  Iframework.Node = Backbone.Model.extend({
    loaded: false,
    defaults: {
      src: "",
      x: 0,
      y: 0,
      w: 100,
      h: 100
    },
    initialize: function () {
      this.inputs = new Iframework.Ports();
      this.outputs = new Iframework.Ports();
    },
    initializeView: function () {
      this.view = new Iframework.NodeView({model:this});
      return this.view;
    },
    send: function (message) {
      if (this.frameIndex !== undefined) {
        window.frames[this.frameIndex].postMessage(message, "*");
      }
    },
    infoLoaded: function (info) {
      if (this.view) {
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
      var replace = this.inputs.findByName(info.name);
      if (replace) {
        return;
      }
      var newPort = new Iframework.Port(info);
      newPort.isIn = true;
      newPort.node = this;
      newPort.graph = this.graph;
      this.inputs.add(newPort);
      if (this.view) {
        this.view.addInput(newPort);
      }
    },
    addOutput: function (info) {
      // Name must be unique
      var replace = this.outputs.findByName(info.name);
      if (replace) {
        return;
      }
      var newPort = new Iframework.Port(info);
      newPort.isIn = false;
      newPort.node = this;
      newPort.graph = this.graph;
      this.outputs.add(newPort);
      if (this.view) {
        this.view.addOutput(newPort);
      }
    },
  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
