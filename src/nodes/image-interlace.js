// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<p class="saveas">'+
      'Right-click to Save Image As...'+
    '</p>'+
    '<div class="control">'+
      '<button class="export">export</button>'+
    '</div>'+
    '<p class="info">'+
      '<a href="http://meemoo.org/hack-tivities/physical-gif.html" target="_blank">How this works.</a> '+
      'If interlacing 3 images, input the one to be viewed from the right first, then middle, then left. '+
      'If interlacing 2 images, input the one to be viewed from the left first, then right. '+
    '</p>';

  Iframework.NativeNodes["image-interlace"] = Iframework.NativeNodes["image"].extend({

    template: _.template(template),
    info: {
      title: "interlace",
      author: "forresto",
      description: "interlace images together"
    },
    events: {
      "click .export"  : "exportImage"
    },
    initializeModule: function(){
      var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
      if (is_chrome) {
        this.$("button").button();
        this.$(".saveas").hide();
      } else {
        this.$("button").hide();
      }
    },
    _added: 0,
    _count: 3,
    inputimage: function (image) {
      if (this._added === 0) {
        // Setup canvas
        this.canvas.width = image.width * this._count;
        this.canvas.height = image.height;
      }
      var sx, sy, sw, sh, dx, dy, dw, dh;
      sx = 0;
      dx = this._added * this._size;
      sy = dy = 0;
      sw = dw = this._size;
      sh = dh = image.height;
      while (sx < image.width) {
        this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        sx += this._size;
        dx += this._size * this._count;
      }
      this._added++;
      if (this._added >= this._count) {
        this.inputsend();
        this._added = 0;
      }
    },
    inputclear: function () {
      this._count = 0;
      this._added = 0;
      this.canvas.width = 10;
      this.canvas.height = 10;
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    inputs: {
      image: {
        type: "image",
        description: "image to add to grid"
      },
      count: {
        type: "int",
        description: "how many images to interlace together, usually 2 or 3",
        min: 2,
        max: 10,
        "default": 3
      },
      size: {
        type: "int",
        description: "strip width",
        min: 1,
        "default": 25
      },
      clear: {
        type: "bang",
        description: "clear the image and tiles"
      },
      send: {
        type: "bang",
        description: "send the image"
      }
    },
    outputs: {
      image: {
        type: "image",
        description: "the whole grid image"
      }
    }

  });


});
