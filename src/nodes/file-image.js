// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  var template = '<img id="img-<%= id %>" class="image" crossorigin="anonymous" style="max-width:100%;" />';

  Iframework.NativeNodes["file-image"] = Iframework.NativeNodes["file"].extend({

    template: _.template(template),
    info: {
      title: "image",
      description: "get image from url"
    },
    initializeModule: function(){      
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext('2d');
    },
    _triedProxy: false,
    inputurl: function (url) {
      this._url = url;
      this.$(".image").attr({
        src: url
      });
      try {
        
      } catch(e) {
        if (!this._triedProxy) {
          var urlSplit = this._url.split("//");
          var proxyUrl = "http://corsproxy.com/"+urlSplit[1];
          this._url = proxyUrl;
          // this.set("url", proxyUrl);
          this.initializeModule();
        }
      }
    },
    inputs: {
      url: {
        type: "string",
        description: "full url to image"
      },
      send: {
        type: "bang",
        description: "send canvas version"
      }
    },
    outputs: {
      image: {
        type: "image"
      }
      // dataurl: {
      //   type: "data:image"
      // }
    }

  });


});
