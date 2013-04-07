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
      this.Inputs = new Iframework.PortsIn();
      this.Outputs = new Iframework.PortsOut();

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
      // Defer to make this safe for infinite loops
      var self = this;
      _.defer(function(){
        self.trigger("send:"+name, value);
      });

    },
    receive: function (name, value) {
      // The listener that hits this is added in the edge
      if (this.view.Native) {
        this.view.Native.receive(name, value);
      }

      // for (var name in message) {
      //   if (this.view.Native) {
      //     this.view.Native.receive(name, message[name]);
      //   }
      // }
    },
    infoLoaded: function (info) {
      this.info = info;
      if (this.view) {
        this.view.infoLoaded(info);
      }
    },
    setState: function () {
      var state = this.get("state");
      if (state && this.view.Native){
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
      var replace = this.Inputs.get(info.name);
      if (replace) {
        replace.set(info);
        return;
      }
      var newPort = new Iframework.PortIn(info);
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
      var replace = this.Outputs.get(info.name);
      if (replace) {
        replace.set(info);
        return;
      }
      var newPort = new Iframework.PortOut(info);
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
    remove: function (fromView) {
      if (fromView) {
        // Called from NodeBoxView.removeModel
        // User initiated undo, so make it undoable
        this.graph.removeNode(this);
      } else {
        // Called from Graph.remove
        // Just remove it
        if (this.view) {
          this.view.remove();
        }
      }
    },
    setValues: function(info) {
      for (var name in info) {
        this.get("state")[name] = info[name];
      }
      this.nodeChanged();
    },
    setValue: function(name, value) {
      this.get("state")[name] = value;
      this.nodeChanged();
    },
    toString: function() {
      if (!!this.info) {
        return "Native node "+this.get("id")+": "+this.info.title;
      } else {
        return "Native node "+this.get("id");
      }
    },
    toJSON: function () {
      return {
        id: this.id,
        src: this.get("src"),
        x: this.get("x"),
        y: this.get("y"),
        w: this.get("w"),
        h: this.get("h"),
        state: this.get("state")
      };
    }

  });
  
  Iframework.Nodes = Backbone.Collection.extend({
    model: Iframework.Node
  });

});
