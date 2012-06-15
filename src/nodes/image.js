$(function(){

  var innerTemplate = '<canvas class="canvas" width="500" height="500" style="max-width:100%" /><div class="info" />';

  Iframework.NativeNodes["image"] = Iframework.NodeBox.extend({

    innerTemplate: _.template(innerTemplate)

  });


});
