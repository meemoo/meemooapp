// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-in"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "image",
      description: "hold a canvas or get image from url"
    },
    initializeModule: function(){
      var canvas = this.model.get("canvas");
      if (canvas){
        this.inputimage( canvas );
        this.model.set("canvas", null);
      }
    },
    inputurl: function (url) {
      if (this._url !== url) {
        this._url = url;
        // Internal image to copy to canvas
        this._image = new Image();
        this._image.crossOrigin = "anonymous";
        var self = this;
        this._image.onload = function(){
          self.canvas.width = self._image.width;
          self.canvas.height = self._image.height;
          self.context.drawImage(self._image, 0, 0);
          self.inputsend();
        };
        this._image.src = url;
      }
    },
    inputimage: function(image){
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      this.context.drawImage(image, 0, 0);
    },
    inputsend: function(){
      this.send("image", this.canvas);
    },
    inputs: {
      image: {
        type: "image",
        description: "image to hold"
      },
      url: {
        type: "string",
        description: "url to image to load"
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
