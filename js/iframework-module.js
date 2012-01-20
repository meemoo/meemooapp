// Module is used for Iframework.Library and has info about ins and outs
// Node is used by Graph, and has info about x, y, w, h

$(function(){

  Iframework.Module = Backbone.Model.extend({
    defaults: {
      "src": "",
      "info": {},
      "inputs": [],
      "outputs": []
    },
    initialize: function () {
    },
    toJSON: function () {
      return {
        "src": this.get("node").get("src"),
        "info": this.get("node").Info,
        "inputs": this.get("node").Inputs.toJSON(),
        "outputs": this.get("node").Outputs.toJSON()
      };
    }
  });
  
  Iframework.Modules = Backbone.Collection.extend({
    model: Iframework.Module,
    findOrAdd: function (node) {
      var module;
      module = this.find(function(module){
        return module.get("src") === node.get("src");
      })
      if (!module) {
        module = new Iframework.Module({"node":node});
        this.add(module);
      }
      return module;
    }
  });

});
