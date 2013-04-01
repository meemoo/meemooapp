/*global filepicker:true*/
// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="info" />'+
    '<div class="choosers">'+
      '<button class="publicfile icon-globe-1">choose or upload public image</button> (choose from device, Flickr, Dropbox, Google...) <br />'+
      '<button class="localfile icon-camera">choose or take local image</button> (not public. from device, mobile camera...) '+
    '<div>'+
    '<div class="savers">'+
      '<button class="publicfile icon-globe-1">save image publicly</button> this canvas is not saved'+
    '<div>';

  Iframework.NativeNodes["image-in"] = Iframework.NativeNodes["image"].extend({

    template: _.template(template),
    info: {
      title: "image",
      description: "hold a canvas or get image from url"
    },
    events: {
      "click .publicfile": "loadPublic",
      "click .localfile":  "loadLocal"
    },
    initializeModule: function(){
      var canvas = this.model.get("canvas");
      if (canvas){
        this.inputimage( canvas );
      }
      this.$(".savers").hide();
    },
    inputurl: function (url) {
      if ( url==="" ){ return false; }

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

      this.$(".choosers, .savers").hide();
    },
    inputimage: function(image){
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      this.context.drawImage(image, 0, 0);
      this.$(".choosers").hide();
    },
    _loadingFilepicker: false,
    loadPublic: function(){
      var self = this;

      // Load filepicker.io library
      if (!window.filepicker) {
        if (!this._loadingFilepicker) {
          Iframework.plugins.gallery.setupFilepicker(this.loadPublic, this);
          this._loadingFilepicker = true;
        }
        return false;
      }

      // Open chooser
      filepicker.pickAndStore(
        {
          mimetype: 'image/*',
          multiple: false,
          maxSize: 5*1024*1024
        }, 
        {
          location: 'S3',
          path: 'v1/',
          access: 'public'
        },
        function(fpfiles){
          console.log(fpfiles);
          self.inputurl(fpfiles[0].url);
          self.set("url", fpfiles[0].url);
        }
      );
    },
    loadLocal: function() {

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
