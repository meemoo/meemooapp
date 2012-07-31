$(function(){

  Iframework.NodeBox = Iframework.Node.extend({
    loaded: false,
    defaults: function() {
      return {
        src: "",
        x: 100,
        y: 400,
        z: 0,
        w: 200,
        h: 210,
        state: {}
      };
    },
    initialize: function () {
      this.Inputs = new Iframework.Ports();
      this.Outputs = new Iframework.Ports();

      // Change event
      this.on("change", this.nodeChanged);

    },
    initializeView: function () {
      // Called from GraphView.addNode
      this.view = new Iframework.NodeBoxView({model:this});
      return this.view;
    },
    initializePorts: function() {
      // For native nodes
      // Called from GraphView.addNode
      if (this.view.inputs) {
        for (var inputname in this.view.inputs) {
          if (this.view.inputs.hasOwnProperty(inputname)) {
            var inInfo = this.view.inputs[inputname];
            inInfo.name = inputname;
            this.addInput(inInfo);
          }
        }
      }
      if (this.view.outputs) {
        for (var outputname in this.view.outputs) {
          if (this.view.outputs.hasOwnProperty(outputname)) {
            var outInfo = this.view.outputs[outputname];
            outInfo.name = outputname;
            this.addOutput(outInfo);
          }
        }
      }
    },
    send: function (name, message) {
      // Send message out to connected modules
      var m = {};
      m[name] = message;
    },
    recieve: function (message) {
      for (var name in message) {
        if (this.view["input"+name]){
          this.view["input"+name](message[name]);
        }
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
      // Set id to name
      info.id = info.name;
      // Name must be unique
      var replace = this.Inputs.findByName(info.name);
      if (replace) {
        replace.set(info);
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
      if ( info.hasOwnProperty("default") && info["default"] !== "" && !currentState.hasOwnProperty(info.name) ) {
        currentState[info.name] = info["default"];
      }
    },
    addOutput: function (info) {
      // Set id to name
      info.id = info.name;
      // Name must be unique
      var replace = this.Outputs.findByName(info.name);
      if (replace) {
        replace.set(info);
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
    },
    setValue: function(info) {
      for (var name in info) {
        this.get("state")[name] = info[name];
      }
      this.nodeChanged();
    }

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
