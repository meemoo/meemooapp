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
    info: {
      title: "native-node",
      description: "extend me"
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
    send: function (name, value) {
      // Send message out to connected modules
      var output = this.Outputs.get(name);
      if (!!output) {
        output.send(value);
      }
    },
    recieve: function (message) {
      for (var name in message) {
        if (!!this.view.Native["input"+name]){
          this.view.Native["input"+name](message[name]);
        } else {
          this.view.Native["_"+name] = message[name];
        }
      }
    },
    infoLoaded: function (info) {
      this.info = info;
      if (this.view) {
        this.view.infoLoaded(info);
      }
    },
    setState: function () {
      var state = this.get("state");
      if (state){
        for (var name in state) {
          if (this.view.Native["input"+name]){
            this.view.Native["input"+name](state[name]);
          } else {
            this.view.Native["_"+name] = state[name];
          }
        }
      }
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
    },
    toString: function() {
      if (!!this.info) {
        return "Native node "+this.get("id")+": "+this.info.title;
      } else {
        return "Native node "+this.get("id");
      }
    }

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
