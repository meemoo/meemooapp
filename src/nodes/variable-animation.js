// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<canvas id="canvas-<%= id %>" class="preview" style="max-width:100%"></canvas>'+
    '<div class="info">frame <span class="index"></span>/<span class="length"></span></div>'+
    '<div class="control">'+
      '<button class="play">play</button>'+
      '<button class="pause">pause</button>'+
      '<button class="prev">prev</button>'+
      '<button class="next">next</button>'+
      '<button class="deleteframe">deleteframe</button>'+
    '</div>';

  Iframework.NativeNodes["variable-animation"] = Iframework.NativeNodes["variable"].extend({

    template: _.template(template),
    info: {
      title: "animation",
      description: "holds a stack of canvases to use as an animation"
    },
    events: {
      "click .play"  : "inputplay",
      "click .pause" : "inputpause",
      "click .prev"  : "inputprev",
      "click .next"  : "inputnext",
      "click .deleteframe"  : "deleteFrame"
    },
    initializeModule: function(){
      this._animation = {
        width: 0, 
        height: 0, 
        fps: 10, 
        frames: [], 
        length: 0
      };
      this.canvas = this.$(".preview")[0];
      this.context = this.canvas.getContext('2d');
      this.$("button").button();
    },
    inputpush: function(image){
      var frame = document.createElement("canvas");
      frame.width = image.width;
      frame.height = image.height;
      frame.getContext('2d').drawImage(image, 0, 0);
      this._animation.frames.push(frame);
      if (this._length && this._animation.frames.length>this._length) {
        var shifted = this._animation.frames.shift();
        this.send("shift", shifted);
      }
      this._animation.length = this._animation.frames.length;
      this._animation.width = image.width;
      this._animation.height = image.height;

      // Info
      this.$(".length").text(this._animation.length);

      // Preview
      if (this.canvas.width !== image.width){
        this.canvas.width = image.width;
      }
      if (this.canvas.height !== image.height){
        this.canvas.height = image.height;
      }
      if (!this._play){
        this.showFrame(this._animation.length-1);
      }

      this.inputsend();
    },
    showFrame: function(i) {
      var frame = this._animation.frames[i];
      if (frame) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(frame, 0, 0);
        this._previewFrame = i;
        this.$(".index").text(i+1);
        this.send("image", this.canvas);
      }
    },
    _ms: 1000/12,
    inputfps: function(fps){
      this._animation.fps = fps;
      this._ms = 1000/fps;

      this.inputsend();
    },
    inputlength: function(i){
      if (i >= 0) {
        this._length = i;
        if (this._length > 0 && this._animation.frames.length > this._length) {
          this._animation.frames.splice(this._length, this._animation.frames.length);
          this._animation.length = this._animation.frames.length;
          this.$(".length").text(this._animation.length);
          if (this._previewFrame >= this._animation.length) {
            // Show last
            this.showFrame(this._animation.length-1);
          }
        }
      }
    },
    deleteFrame: function(){
      this.inputpause();
      this._animation.frames.splice(this._previewFrame, 1);
      this._animation.length = this._animation.frames.length;
      this.$(".length").text(this._animation.length);
      // Show next preview
      if (this._animation.length <= 0) {
        // No frames, make blank
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.$(".index").text("0");
      } else if (this._previewFrame >= this._animation.length) {
        // Show last
        this.showFrame(this._animation.length-1);
      } else {
        // Show next
        this.showFrame(this._previewFrame);
      }
    },
    _play: false,
    inputplay: function(){
      this._play = true;
    },
    inputpause: function(){
      this._play = false;
    },
    _previewFrame: 0,
    inputprev: function(){
      // Pause
      this.inputpause();
      // Show prev or loop back
      if (this._previewFrame > 0) {
        this.showFrame(this._previewFrame-1);
      } else {
        this.showFrame(this._animation.frames.length-1);
      }
    },
    inputnext: function(){
      this.inputpause();
      // Show next or loop
      if (this._previewFrame < this._animation.frames.length-1) {
        this.showFrame(this._previewFrame+1);
      } else {
        this.showFrame(0);
      }
    },
    inputsend: function(){
      this.send("animation", this._animation);
    },
    redraw: function(timestamp){
    },
    renderAnimationFrame: function (timestamp) {
      if (this._play && timestamp-this._lastRedraw>=this._ms) {
        this._previewFrame++;
        if (this._previewFrame >= this._animation.frames.length) {
          // Loop
          this._previewFrame = 0;
        }
        this.showFrame(this._previewFrame);

        this._lastRedraw = timestamp;
      }
    },
    inputs: {
      push: {
        type: "image",
        description: "adds image to end of array"
      },
      length: {
        type: "int",
        description: "max length of array"
      },
      fps: {
        type: "float",
        description: "frames per second to animate",
        "default": 12
      },
      play: {
        type: "bang",
        description: "start the preview animation"
      },
      pause: {
        type: "bang",
        description: "stop the preview animation"
      },
      prev: {
        type: "bang",
        description: "when paused, show the prev frame"
      },
      next: {
        type: "bang",
        description: "when paused, show the next frame"
      },
      sendOne: {
        type: "int",
        description: "sends canvas with this index"
      },
      send: {
        type: "bang",
        description: "sends animation object"
      }
    },
    outputs: {
      image: {
        type: "image",
        description: "the preview canvas"
      },
      animation: {
        type: "animation",
        description: "animation object has width, height, fps, frames (array of canvases), and length (frames.length)"
      },
      shift: {
        type: "image",
        description: "overflow canvas that is shifted from array"        
      }
    }

  });


});
