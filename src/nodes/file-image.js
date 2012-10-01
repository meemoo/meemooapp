// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="image"><img class="img" crossorigin="anonymous" style="max-width:100%;"></div>'+
    '<div class="info" />';

  Iframework.NativeNodes["file-image"] = Iframework.NativeNodes["file"].extend({

    template: _.template(template),
    info: {
      title: "image-in",
      description: "get image from url"
    },
    initializeModule: function(){      
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext('2d');
    },
    // _triedProxy: false,
    inputurl: function (url) {
      if (this._url !== url) {
        this._url = url;
        this._corsTested = false;
        this._corsOK = false;
        // Internal image to copy to canvas
        this._image = new Image();
        this._image.crossOrigin = "anonymous";
        this._image.style.maxWidth = "100%";
        var self = this;
        this._image.onload = function(){
          self.inputsend();
        };
        this._image.src = url;
        this.$(".img")[0].src = url;
      }
    },
    _corsTested: false,
    _corsOK: false,
    inputsend: function(){
      if (!this._image) { return false; }
      if (!this._corsTested) {
        var testCanvas = document.createElement("canvas");
        var testContext = testCanvas.getContext("2d");
        testContext.drawImage(this._image, 0, 0);
        try {
          testContext.getImageData(0, 0, 1, 1);
          this._corsOK = true;
          this.$(".info").html('');
        } catch (e) {
          this._corsOK = false;
          this.$(".info").html('( ;_;) We can\'t get the image data. Encourage your image host to <a href="http://enable-cors.org/" target="_blank">enable CORS</a>. There might be a workaround by using <a href="http://www.corsproxy.com/" target="_blank">this proxy</a> in the URL.');
        }
        this._corsTested = true;
      }
      if (this._corsOK) {
        console.log(this._image.width, this._image.height);
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = this._image.width;
        this.canvas.height = this._image.height;
        this.context.drawImage(this._image, 0, 0);
        this.send("image", this.canvas);
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
