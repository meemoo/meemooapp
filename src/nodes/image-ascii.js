// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  var template = '<pre class="output" style="font-family:monospace; font-size:12px; line-height:70%;"></pre>'+
    '<div class="char-sets">'+
      '<button class="set-chars ascii" title="#MX$SBPCxc=!~-,._ " data-h="70%">ascii</button>'+
      '<button class="set-chars ansi" title="█░ " data-h="80%">ansi</button>'+
      '<button class="set-chars katakana" title="テチタヌオネモキツシウミリンソトレニノ　" data-h="100%">katakana</button>'+
      // '<button class="set-chars emoji" title="" data-h="90%">emoji</button>'+
    '</div>';

  var lumR = [];
  var lumG = [];
  var lumB = [];
  for (var i=0; i<256; i++) {
    lumR[i] = i*0.299;
    lumG[i] = i*0.587;
    lumB[i] = i*0.114;
  }

  Iframework.NativeNodes["image-ascii"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "ascii",
      author: "forresto",
      description: "ascii text or emoji art"
    },
    template: _.template(template),
    events: {
      "click .set-chars": "setChars"
    },
    initializeModule: function(){
      $(this.canvas).remove();
    },
    inputcharacters: function (characters) {
      this._characters = characters;
      var split = characters.split("");
      var splitLength = split.length;
      this._charr = [];
      for (var i=0; i<256; i++) {
        this._charr[i] = split[ Math.floor(i/256*splitLength) ];
      }
      this._triggerRedraw = true;
    },
    setChars: function (event) {
      var button = $(event.target);
      this.$(".output").css("line-height", button.data("h"));
      var chars = button.attr("title");
      this.inputcharacters(chars);
      this.set("characters", chars);
    },
    inputsend: function () {
      this.send("text", this.outputString);
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (this._image) {
        if (this.canvas.width !== this._width) {
          this.canvas.width = this._width;
        }
        if (this.canvas.height !== this._height) {
          this.canvas.height = this._height;
        }
        Iframework.util.fitAndCopy(this._image, this.canvas);
        var imageData = this.context.getImageData(0,0, this.canvas.width, this.canvas.height);

        var string = "";
        var count = 0;
        for (var y=0; y<this._height; y++) {
          for (var x=0; x<this._width; x++) {
            var lum = Math.floor(lumR[imageData.data[count++]] + lumG[imageData.data[count++]] + lumB[imageData.data[count++]]);
            string += this._charr[lum];
            count++;
          }
          string += "\n";
        }
        this.$(".output").text(string);
      }
      this.inputsend();
    },
    inputs: {
      image: {
        type: "image",
        description: "image to dither"
      },
      characters: {
        type: "string",
        description: "the characters that will be used in the conversion, dark to light",
        "default": "#MX$SBPCxc=!~-,._ "
      },
      width: {
        type: "int",
        description: "text width",
        min: 1,
        max: 500,
        "default": 20
      },
      height: {
        type: "int",
        description: "text height",
        min: 1,
        max: 500,
        "default": 20
      },
      send: {
        type: "bang",
        description: "send the text"
      }
    },
    outputs: {
      text: {
        type: "string"
      }
    }

  });


});
