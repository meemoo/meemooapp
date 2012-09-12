/*global Whammy:true*/

$(function(){

  var template = '<div class="info" /><button class="encode">encode video</button><div class="videos" />';

  Iframework.NativeNodes["file-webm"] = Iframework.NativeNodes["file"].extend({

    template: _.template(template),
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
      this.$(".encode")
        .button()
        .click(function(){
          self.inputencode();
        })
        .hide();
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
        if (this._frameCount === 1) {
          this.$(".encode").show();
        }
      }
    },
    inputencode: function () {
      if (!this._encoder) {
        // No frames yet
        return false;
      }

      this.$(".encode").hide();

      // Encode
      var start_time = new Date();
      var output = this._encoder.compile();
      var end_time = new Date();
      var url = (window.webkitURL || window.URL).createObjectURL(output);

      var videoDiv = $('<div class="video" />');

      // Video element
      var videoEl = '<video src="'+url+'" controls autoplay loop style="max-width:100%;"></video>';
      videoDiv.append(videoEl);

      // Send blob URL
      this.send("url", url);

      // Info
      var info = $('<p>'+
          '<a href="'+url+'" target="_blank">Download</a> (add .webm) <br />'+
          'Compiled '+ this._frameCount +' frames to video in ' + (end_time - start_time) + 'ms, '+
          'video length: '+ Math.round(this._frameCount / this._fps * 100)/100 +'s ('+this._fps+'fps), '+
          'file size: '+ Math.ceil(output.size / 1024) +'KB <br />'+
        '</p>');
      var deleteLink = $('<a href="#">Delete</a>')
        .click(function(){
          $(this).parent().parent().remove();
          return false;
        });
      info.append(deleteLink);
      videoDiv.append(info);

      this.$(".videos").prepend(videoDiv);

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
      url: {
        type: "string",
        description: "local blob url of video"
      }
    }

  });


});
