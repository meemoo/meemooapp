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
      this.inputs = {};
      this.outputs = {};
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
      if (this.view && !this.inputs.hasOwnProperty(info.name)) { 
        this.inputs[info.name] = info;
        this.view.addInput(info); 
      }
    },
    addOutput: function (info) {
      if (this.view && !this.outputs.hasOwnProperty(info.name)) { 
        this.outputs[info.name] = info;
        this.view.addOutput(info); 
      }
    }
  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
