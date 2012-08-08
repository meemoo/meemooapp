// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  var template = '<img id="img-<%= id %>" class="image" style="max-width:100%;" />';

  Iframework.NativeNodes["file-image"] = Iframework.NativeNodes["file"].extend({

    template: _.template(template),
    info: {
      title: "image",
      description: "get image from url"
    },
    initializeModule: function(){      
    },
    inputurl: function (url) {
      this.$(".image").attr({
        src: url
      });
    },
    inputs: {
      url: {
        type: "string",
        description: "full url to image"
      }
    },
    outputs: {
      // image: {
      //   type: "image"
      // },
      // dataurl: {
      //   type: "data:image"
      // }
    }

  });


});
