// Module is used for Iframework.Library and has info about ins and outs
// Node is used by Graph, and has info about x, y, w, h

$(function(){

  Iframework.Module = Backbone.Model.extend({
    defaults: {
      "src": "",
      "info": {}
    },
    initialize: function () {
      var srcSplit = this.get("src").split(":");
      this.isNative = (srcSplit[0] === "meemoo");
      if (this.isNative) {
        this.groupAndName = srcSplit[1].split("/");
      }
    },
    initializeView: function () {
      if (!this.view) {
        this.view = new Iframework.ModuleView({model:this});
      }
      return this.view;
    },
    toJSON: function () {
      return {
        "src": this.get("src"),
        "info": this.get("info")
      };
    }
  });
  
  Iframework.Modules = Backbone.Collection.extend({
    model: Iframework.Module,
    findOrAdd: function (node) {
      var module;
      module = this.find(function(module){
        return module.get("src") === node.get("src");
      });
      if (!module) {
        module = new Iframework.Module({"node":node});
        this.add(module);
      }
      return module;
    }
  });

});
