$(function(){

  Iframework.NativeNodes = {};

  Iframework.NativeNodeBase = Backbone.Model.extend({

    initialize: function () {
      this.node = this.get("node");
      this.nodeid = this.node.get("id");
    },

    parentWindow: window,
    nodeid: undefined,
    connectedTo: [],
    setInfo: function (info) {
      var i = {};
      if (info.hasOwnProperty("title")) {
        i.title = info.title;
      }
      if (info.hasOwnProperty("author")) {
        i.author = info.author;
      }
      if (info.hasOwnProperty("description")) {
        i.description = info.description;
      }

      //
      this.node.infoLoaded(i);

      return this;
    },
    info: {

    },
    sendParent: function (action, message){
      // if (this.parentWindow) {
      //   var o = {};
      //   o[action] = message ? message : action;
      //   o["nodeid"] = meemoo.nodeid;
      //   this.parentWindow.postMessage(o, "*");
      // }
    },
    send: function (action, message) {
      if ( action === undefined || this.connectedTo.length < 1 ) { 
        return; 
      }
      if (message === undefined) { message = action; }
      for (var i=0; i<this.connectedTo.length; i++) {
        if (this.connectedTo[i].source[1] === action) {
          var m;
          // Sends an object: {actionName:data}
          m = {};
          m[this.connectedTo[i].target[1]] = message;

          var id = this.connectedTo[i].target[0].split("_")[1];
          var toNode = Iframework.shownGraph.get("nodes").get(id);

          _.defer(function(){
            toNode.recieve(m);
          });
          // toNode.recieve(m);

        }
      }
    },
    recieve: function (m) {
      for (var name in m) {
        if ( m.hasOwnProperty(name) ) {
          // if ( this.inputs.hasOwnProperty(name) ) {
          //   meemoo.inputs[name](e.data[name], e);
          if ( this["input"+name] ) {
            this["input"+name](m[name]);
          } else if ( this["framework"+name] ) {
            this["framework"+name](m[name]);
          }
        }
      }
    },
    // Inputs are functions available for other modules to trigger
    addInput: function(name, input) {
      var portproperties = {};
      portproperties.name = name;
      portproperties.type = input.hasOwnProperty("type") ? input.type : "";
      portproperties.description = input.hasOwnProperty("description") ? input.description : "";
      portproperties.min = input.hasOwnProperty("min") ? input.min : "";
      portproperties.max = input.hasOwnProperty("max") ? input.max : "";
      portproperties.options = input.hasOwnProperty("options") ? input.options : "";
      portproperties.default = input.hasOwnProperty("default") ? input.default : "";
      
      if (input.port !== false) {
        // Expose port
        this.node.addInput(portproperties);
      }
      return this;
    },
    addInputs: function(inputs) {
      for (var name in inputs) {
        if (inputs.hasOwnProperty(name)) {
          this.addInput(name, inputs[name]);
        }
      }
      // Set all inputs, then ask for state
      this.node.stateReady();
      return this;
    },
    inputs: {},
    // Outputs
    addOutput: function(name, output) {
      if (output.port !== false) {
        // Expose port
        this.node.addOutput({name:name, type:output.type});
      }
      return this;
    },
    addOutputs: function(outputs) {
      for (var name in outputs) {
        if (outputs.hasOwnProperty(name)) {
          this.addOutput(name, outputs[name]);
        }
      }
      return this;
    },
    // frameworkActions: {
      frameworkconnect: function (edge) {
        // Make sure it is unique
        for(var i=0; i<this.connectedTo.length; i++) {
          var thisEdge = this.connectedTo[i];
          if (thisEdge.source[0] === edge.source[0] && thisEdge.source[1] === edge.source[1] && thisEdge.target[0] === edge.target[0] && thisEdge.target[1] === edge.target[1]) {
            // Not unique
            return false;
          }
        }
        this.connectedTo.push(edge);
      },
      frameworkdisconnect: function (edge) {
        var results = [];
        for(var i=0; i<this.connectedTo.length; i++) {
          var thisEdge = this.connectedTo[i];
          // Only keep it if something is different
          if (thisEdge.source[0] !== edge.source[0] || thisEdge.source[1] !== edge.source[1] || thisEdge.target[0] !== edge.target[0] || thisEdge.target[1] !== edge.target[1]) {
            results.push(thisEdge);
          }
        }
        this.connectedTo = results;
      },
      frameworkgetState: function () {
        //TODO save these as they are input?
        // Send a state to parent, called when saving composition
        var state = {};
        this.sendParent("state", state);
      },
      frameworksetState: function (state) {
        // Setup module with saved data matching getState() returned object
        // Called when loading composition
        for (var name in state) {
          if (this.inputs.hasOwnProperty(name)) {
            this.inputs[name](state[name]);
          }
        }
      }
    // }
  });


});
