// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-interlace"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "interlace",
      author: "forresto",
      description: "interlace images together"
    },
    initializeModule: function(){
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
