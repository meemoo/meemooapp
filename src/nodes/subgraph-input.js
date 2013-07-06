// extends src/nodes/graph.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["subgraph-input"] = Iframework.NativeNodes["subgraph"].extend({

    info: {
      title: "input",
      description: "publish input for when this graph is a subgraph"
    },
    inputlabel: function (label) {
      this.$el.text(label);
      this.model.trigger("changelabel", label);
    },
    inputdata: function (data) {
      this.send("data", data);
    },
    inputs: {
      label: {
        type: "string",
        "default": "in"
      }
    },
    outputs: {
      data: {
        type: "all"
      }
    }

  });


});
