/*global Whammy:true*/

$(function(){

  Iframework.NativeNodes["file-webm"] = Iframework.NativeNodes["file"].extend({

    info: {
      title: "webm",
      description: "encode canvases to WebM video (requires WebP = Chrome only for now)"
    },
    initializeModule: function(){      
      var self = this;
      if (window.Whammy) {
        this.$('.info').text("ready");
        this._ready = true;
      } else {
        yepnope({
          load: "libs/whammy/whammy.js",
          complete: function () {
            self.initializeModule();
          }
        });
      }
    },
    _frameCount: 0,
    inputimage: function (image) {
      if (this._ready) {
        if (!this._encoder) {
          // Setup encoder
          this._encoder = new Whammy.Video(this._fps);
        }
        this._encoder.add(image);
        this._frameCount++;
        this.$('.info').text(this._frameCount+" frames");
      }
    },
    inputencode: function () {
      if (!this._encoder) {
        // No frames yet
        return false;
      }

      // Encode
      var start_time = new Date();
      var output = this._encoder.compile();
      var end_time = new Date();
      var url = (window.webkitURL || window.URL).createObjectURL(output);

      // Video element
      var videoEl = '<video src="'+url+'" controls autoplay loop style="max-width:100%;"></video>';
      this.$el.append(videoEl);

      // Info
      var info = '<p>'+
          'Compiled '+ this._frameCount +' frames to video in ' + (end_time - start_time) + 'ms, '+
          'file size: '+ Math.ceil(output.size / 1024) +'KB '+
          '<a href="'+url+'" target="_blank">Download</a> (add .webm)'+
        '</p>';
      this.$el.append(info);

      // Set encoder to null, ready for next
      this._encoder = null;
      this._frameCount = 0;
      this.$('.info').text("ready");
    },
    inputs: {
      image: {
        type: "image",
        description: "canvas images to be added to the webm video"
      },
      fps: {
        type: "int",
        description: "framerate in frames per second",
        "default": 30
      },
      encode: {
        type: "bang",
        description: "encode the stack of frames into a video"
      }
    },
    outputs: {
    }

  });


});
