// extends src/nodes/util.js which extends src/node-box-native-view.js

$(function(){

  var FILEPICKER_API_KEY = "AaqPpE9LORQel03S9cCl7z";
  var IMAGE_SERVER = "http://i.meemoo.me/";

  Iframework.NativeNodes["util-openartpublish"] = Iframework.NativeNodes["util"].extend({

    info: {
      title: "Open(Art)",
      description: "publish to Open(Art) gallery"
    },
    initializeModule: function(){
      this.img = new Image();
      this.$el.append(this.img);
    },
    lastimg: "",
    inputimg: function (dataurl) {
      if (this.lastimg === dataurl) { return false; }
      if (!window.filepicker){
        this.$(".info").text("Offline or image service not available.");
        return false;
      }

      this.lastimg = dataurl;
      this.img.src = dataurl;
      this.$(".info").text("Uploading...");

      var split = dataurl.split(',', 2);
      var type = split[0].split(':')[1].split(';')[0];
      var ext = type.split('/')[1];
      b64 = split[1];
      fileinfo = {
        mimetype: type,
        location: 'S3',
        path: 'openart/meemoo/',
        filename: 'meemoo-openart-stopmotion.'+ext,
        access: 'public',
        base64decode: true
      };

      var self = this;
      filepicker.store(
        b64, 
        fileinfo, 
        function (file) {
          // Public s3 URL
          var s3url = IMAGE_SERVER + file.key;

          var data = {
            "_csrf": "Hkge_JRS92Kv_j97ADBHGzpT",
            "title": "meemoo stopmotion",
            "description": "made with meemoo.org at Open(Art), Eyebeam NYC",
            "url": "http://meemoo.org/iframework/#example/cam2gif",
            "image": s3url,
            "author": "author"
          };

          // Post to gallery
          $.ajax({
            type: "POST",
            url: "http://fast-crag-2176.herokuapp.com/post",
            data: data,
            success: function(event){ console.log(event); }
          });

          // Info
          self.$(".info").text('Find your image at openart.eyebeam.org/gallery ');
        }, 
        function (error) {
          self.$(".info").text('Upload error :-( ');
          self.lastimg = "";
        }, 
        function (percent) {
          self.$(".info").text(percent + "% uploaded. ");
        }
      );

    },
    inputs: {
      img: {
        type: "data:image",
        description: "image to publish"
      }
    },
    outputs: {
    }

  });


});
