// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="control">'+
      '<button class="start">start</button>'+
      '<button class="stop">stop</button>'+
    '</div>';

  Iframework.NativeNodes["image-slitscan"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "slitscan",
      author: "forresto",
      description: "slitscan in different directions"
    },
    template: _.template(template),
    events: {
      "click .start": "inputstart",
      "click .stop":  "inputstop"
    },
    initializeModule: function(){
      this.$("button").button();
    },
    inputwidth: function (i) {
      this._width = i;
      this.canvas.width = i;
    },
    inputheight: function (i) {
      this._height = i;
      this.canvas.height = i;
    },
    _scanning: false,
    inputstart: function () {
      this._scanning = true;
      if (!this._fixed) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this._position = 0;
    },
    inputstop: function () {
      this._scanning = false;
      this._position = 0;
    },
    inputclear: function () {
      this.inputstop();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    _position: 0,
    _speed: 1,
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (this._stream && this._scanning) {
        var sx, sy, sw, sh, dx, dy, dw, dh;
        if (this._fixed) {
          if (this._direction === "up") {
            this.context.drawImage(this.canvas, 0, 0-this._speed);
            sx = 0;
            sy = Math.floor(this._stream.height/2);
            sw = this._stream.width;
            sh = this._speed;
            dx = 0;
            dy = this.canvas.height-1 - this._speed;
          } else if (this._direction === "down") {
            this.context.drawImage(this.canvas, 0, this._speed);
            sx = 0;
            sy = Math.floor(this._stream.height/2);
            sw = this._stream.width;
            sh = this._speed;
            dx = 0;
            dy = 0;
          } else if (this._direction === "left") {
            this.context.drawImage(this.canvas, 0-this._speed, 0);
            sx = Math.floor(this._stream.width/2);
            sy = 0;
            sw = this._speed;
            sh = this._stream.height;
            dx = this.canvas.width-1 - this._speed;
            dy = 0;
          } else {
            // right
            this.context.drawImage(this.canvas, this._speed, 0);
            sx = Math.floor(this._stream.width/2);
            sy = 0;
            sw = this._speed;
            sh = this._stream.height;
            dx = 0;
            dy = 0;
          }
          dw = sw;
          dh = sh;
          this.context.drawImage(this._stream, sx, sy, sw, sh, dx, dy, dw, dh);
          this.inputsend();
        } else {
          // Not fixed
          if (this._direction === "up") {
            sx = 0;
            sy = this._stream.height-1 - this._position*this._speed;
            sw = this._stream.width;
            sh = this._speed;
          } else if (this._direction === "down") {
            sx = 0;
            sy = this._position*this._speed;
            sw = this._stream.width;
            sh = this._speed;
          } else if (this._direction === "left") {
            sx = this._stream.width-1 - this._position*this._speed;
            sy = 0;
            sw = this._speed;
            sh = this._stream.height;
          } else {
            // right
            sx = this._position*this._speed;
            sy = 0;
            sw = this._speed;
            sh = this._stream.height;
          }
          dx = sx;
          dy = sy;
          dw = sw;
          dh = sh;
          this.context.drawImage(this._stream, sx, sy, sw, sh, dx, dy, dw, dh);
          this._position++;
          var done = false;
          if (this._direction === "up" || this._direction === "down") {
            if (this._position*this._speed >= this._stream.height+this._speed) {
              done = true;
            }
          } else {
            if (this._position*this._speed >= this._stream.width+this._speed) {
              done = true;
            }
          }
          if (done) {
            this.inputstop();
            this.inputsend();
          }
        }
      }
    },
    inputs: {
      stream: {
        type: "image",
        description: "video stream to scan"
      },
      width: {
        type: "int",
        description: "image width",
        min: 1,
        "default": 500
      },
      height: {
        type: "int",
        description: "image height",
        min: 1,
        "default": 500
      },
      direction: {
        type: "string",
        description: "direction to scan",
        options: "up right down left".split(" "),
        "default": "right"
      },
      speed: {
        type: "int",
        description: "speed is the thickness of the scan line",
        min: 1,
        "default": 1
      },
      fixed: {
        type: "boolean",
        description: "fixes the input column of pixels for a continuous scan",
        "default": false
      },
      start: {
        type: "bang",
        description: "start scanning"
      },
      stop: {
        type: "bang",
        description: "stop scanning"
      },
      clear: {
        type: "bang",
        description: "clear the image"
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
