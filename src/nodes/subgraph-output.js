// extends src/nodes/graph.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["subgraph-output"] = Iframework.NativeNodes["subgraph"].extend({

    info: {
      title: "output",
      description: "publish output for when this graph is a subgraph"
    },
    inputlabel: function (label) {
      this.$el.text(label);
      this.model.trigger("changelabel", label);
    },
    inputdata: function (data) {
      if (this.model.parentGraph.isSubgraph) {
        // this.send("data", data);
        this.model.trigger("subgraphSend", data);
      }
    },
    inputs: {
      label: {
        type: "string",
        "default": "out"
      },
      data: {
        type: "all"
      }
    },
    outputs: {
    }

  });


});
