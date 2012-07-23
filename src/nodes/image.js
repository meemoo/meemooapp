$(function(){

  Iframework.NativeNodes["image"] = Iframework.NodeBox.extend({

    initializeView: function () {
      // Called from GraphView.addNode();
      this.view = new Iframework.NativeNodes["image-view"]({model:this});
      return this.view;
    }

  });
  

  var innerTemplate = '<canvas class="canvas" width="500" height="500" style="max-width:100%" /><div class="info" />';

  Iframework.NativeNodes["image-view"] = Iframework.NodeBoxView.extend({

    innerTemplate: _.template(innerTemplate)

  });


});
