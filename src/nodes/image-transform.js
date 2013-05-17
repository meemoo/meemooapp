// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-transform"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "transform",
      description: "scale, translate, and/or rotate image"
    },
    dragstart: null,
    initializeModule: function(){
      // this.showResizer(20,20,0.5);

      // TODO drag to move x, y

      // var self = this;
      // $(this.canvas).draggable({
      //   helper: function(){
      //     return $('<div style="width:10px;height:10px;border:1px black dotted;"></div>');
      //   },
      //   start: function(event, ui){
      //     self.dragstart = [self._x, self._y];
      //     console.log(event, ui);
      //     // self.dragstart
      //   },
      //   drag: function(event, ui){
      //     console.log(event, ui);
      //   },
      //   stop: function(event, ui){

      //     self.dragstart = null;
      //     event.stopPropagation();
      //   }
      // });
    },
    inputrotate: function (percent) {
      this._rotate = percent * 2 * Math.PI;
      this._triggerRedraw = true;
    },
    _sizeChanged: false,
    inputwidth: function (i) {
      this._width = i;
      this._sizeChanged = true;
      this._triggerRedraw = true;
    },
    inputheight: function (i) {
      this._height = i;
      this._sizeChanged = true;
      this._triggerRedraw = true;
    },
    inputscale: function (f) {
      f = Math.max(f, 0);
      this._scale = f;
      this._triggerRedraw = true;
    },
    disconnectEdge: function(edge) {
      // Called from Edge.disconnect();
      if (edge.Target.id === "background") {
        this._background = null;
        this._triggerRedraw = true;
      }
      if (edge.Target.id === "image") {
        this._image = null;
        this._triggerRedraw = true;
      }
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (this._sizeChanged) {
        if (this.canvas.width !== this._width) {
          this.canvas.width = this._width;
        }
        if (this.canvas.height !== this._height) {
          this.canvas.height = this._height;
        }
        this.inputsmoothing(this._smoothing);
        this._sizeChanged = false;
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this._background) {
        this.context.globalCompositeOperation = 'source-over';
        this.context.drawImage(this._background, 0, 0);
      }
      if (this._image && this._image.width && this._image.height) {
        var width = this._image.width * this._scale;
        var height = this._image.height * this._scale;
        var x = this.canvas.width/2 + this._translateX;
        var y = this.canvas.height/2 + this._translateY;
        
        this.context.globalCompositeOperation = this._composite;

        // context.save();
        this.context.translate(x, y);
        this.context.rotate(this._rotate);
        this.context.drawImage(this._image, -width/2, -height/2, width, height);
        // context.restore();
        this.context.rotate(-this._rotate);
        this.context.translate(-x, -y);
      }

      this.inputsend();
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    inputs: {
      image: {
        type: "image",
        description: "image to center and transform"
      },
      background: {
        type: "image",
        description: "background image"
      },
      width: {
        type: "int",
        description: "canvas width",
        min: 1,
        "default": 500
      },
      height: {
        type: "int",
        description: "canvas height",
        min: 1,
        "default": 500
      },
      scale: {
        type: "float",
        description: "scale percentage",
        "default": 1.0
      },
      translateX: {
        type: "float",
        description: "translate x pixels",
        "default": 0
      },
      translateY: {
        type: "float",
        description: "translate y pixels",
        "default": 0
      },
      rotate: {
        type: "float",
        description: "rotate percentage",
        "default": 0
      },
      composite: {
        type: "string",
        description: "composite (source-over, source-in, source-out, source-atop, destination-over, destination-in, destination-out, destination-atop, lighter, darker, copy, xor) and/or blend mode (Firefox 20 only as of April 2013: normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion, hue, saturation, color, luminosity) ",
        options: ['source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop', 'lighter', 'darker', 'copy', 'xor', 
          'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'],
        "default": "source-over"
      },
      smoothing: {
        type: "boolean",
        description: "true for smooth image transforms, false for pixeley (only in firefox and chrome)",
        "default": "true"
      },
      // clear: {
      //   type: "bang",
      //   description: "clear the canvas"
      // },
      send: {
        type: "bang",
        description: "send the image"
      }
    },
    outputs: {
      image: {
        type: "image"
      }
    }

  });


});
