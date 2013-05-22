// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){


  /*
    // Thanks ecellingsworth http://stackoverflow.com/a/14641495/592125

    if (String.prototype.ucLength === undefined) {
        String.prototype.ucLength = function() {
            // this solution was taken from 
            // http://stackoverflow.com/questions/3744721/javascript-strings-outside-of-the-bmp
            return this.length - this.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g).length + 1;
        };
    }

    if (String.prototype.codePointAt === undefined) {
        String.prototype.codePointAt = function (ucPos) {
            if (isNaN(ucPos)){
                ucPos = 0;
            }
            var str = String(this);
            var codePoint = null;
            var pairFound = false;
            var ucIndex = -1;
            var i = 0;  
            while (i < str.length){
                ucIndex += 1;
                var code = str.charCodeAt(i);
                var next = str.charCodeAt(i + 1);
                pairFound = (0xD800 <= code && code <= 0xDBFF && 0xDC00 <= next && next <= 0xDFFF);
                if (ucIndex == ucPos){
                    codePoint = pairFound ? ((code - 0xD800) * 0x400) + (next - 0xDC00) + 0x10000 : code;
                    break;
                } else{
                    i += pairFound ? 2 : 1;
                }
            }
            return codePoint;
        };
    }

    if (String.fromCodePoint === undefined) {
        String.fromCodePoint = function () {
            var strChars = [], codePoint, offset, codeValues, i;
            for (i = 0; i < arguments.length; ++i) {
                codePoint = arguments[i];
                offset = codePoint - 0x10000;
                if (codePoint > 0xFFFF){
                    codeValues = [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)];
                } else{
                    codeValues = [codePoint];
                }
                strChars.push(String.fromCharCode.apply(null, codeValues));
            }
            return strChars.join("");
        };
    }

    if (String.prototype.ucCharAt === undefined) {
        String.prototype.ucCharAt = function (ucIndex) {
            var str = String(this);
            var codePoint = str.codePointAt(ucIndex);
            var ucChar = String.fromCodePoint(codePoint);
            return ucChar;
        };
    }

    if (String.prototype.ucIndexOf === undefined) {
        String.prototype.ucIndexOf = function (searchStr, ucStart) {
            if (isNaN(ucStart)){
                ucStart = 0;
            }
            if (ucStart < 0){
                ucStart = 0;
            }
            var str = String(this);
            var strUCLength = str.ucLength();
            searchStr = String(searchStr);
            var ucSearchLength = searchStr.ucLength();
            var i = ucStart;
            while (i < strUCLength){
                var ucSlice = str.ucSlice(i,i+ucSearchLength);
                if (ucSlice == searchStr){
                    return i;
                }
                i++;
            }
            return -1;
        };
    }

    if (String.prototype.ucLastIndexOf === undefined) {
        String.prototype.ucLastIndexOf = function (searchStr, ucStart) {
            var str = String(this);
            var strUCLength = str.ucLength();
            if (isNaN(ucStart)){
                ucStart = strUCLength - 1;
            }
            if (ucStart >= strUCLength){
                ucStart = strUCLength - 1;
            }
            searchStr = String(searchStr);
            var ucSearchLength = searchStr.ucLength();
            var i = ucStart;
            while (i >= 0){
                var ucSlice = str.ucSlice(i,i+ucSearchLength);
                if (ucSlice == searchStr){
                    return i;
                }
                i--;
            }
            return -1;
        };
    }

    if (String.prototype.ucSlice === undefined) {
        String.prototype.ucSlice = function (ucStart, ucStop) {
            var str = String(this);
            var strUCLength = str.ucLength();
            if (isNaN(ucStart)){
                ucStart = 0;
            }
            if (ucStart < 0){
                ucStart = strUCLength + ucStart;
                if (ucStart < 0){ ucStart = 0;}
            }
            if (typeof(ucStop) == 'undefined'){
                ucStop = strUCLength - 1;
            }
            if (ucStop < 0){
                ucStop = strUCLength + ucStop;
                if (ucStop < 0){ ucStop = 0;}
            }
            var ucChars = [];
            var i = ucStart;
            while (i < ucStop){
                ucChars.push(str.ucCharAt(i));
                i++;
            }
            return ucChars.join("");
        };
    }

    if (String.prototype.ucSplit === undefined) {
        String.prototype.ucSplit = function (delimeter, limit) {
            var str = String(this);
            var strUCLength = str.ucLength();
            var ucChars = [];
            if (delimeter == ''){
                for (var i = 0; i < strUCLength; i++){
                    ucChars.push(str.ucCharAt(i));
                }
                ucChars = ucChars.slice(0, 0 + limit);
            } else{
                ucChars = str.split(delimeter, limit);
            }
            return ucChars;
        };
    }

  */



  var template = '<pre class="output" style="font-family:monospace; font-size:12px; line-height:70%;"></pre>'+
    '<div class="char-sets">'+
      '<button class="set-chars ascii" title="#MBX$PxOo=*!~-^,._ " data-h="70%">ascii</button>'+
      '<button class="set-chars ansi" title="█ " data-h="90%">ansi</button>'+
      '<button class="set-chars katakana" title="テチタヌオネモキツシウミリンソトレニノ　" data-h="100%">katakana</button>'+
      // '<button class="set-chars emoji" title="🌑🌒🌘🌓🌗🌔🌖🌕" data-h="90%">emoji</button>'+
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
      // var split = characters.ucSplit("");
      var split = characters.split("");
      // console.log(split);
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
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        Iframework.util.fitAndCopy(this._image, this.canvas);
        var imageData = this.context.getImageData(0,0, this.canvas.width, this.canvas.height);

        var string = "";
        var count = 0;
        for (var y=0; y<this._height; y++) {
          for (var x=0; x<this._width; x++) {
            var r = imageData.data[count++];
            var g = imageData.data[count++];
            var b = imageData.data[count++];
            var lum = Math.floor(lumR[r] + lumG[g] + lumB[b]);
            string += (this._color ? '<span style="color:rgb('+r+','+g+','+b+')">' : "") + this._charr[lum] + (this._color ? '</span>' : "");
            count++; // ignore alpha
          }
          string += "\n";
        }
        this.$(".output").html(string);
        this.outputString = (this._color ? '<pre>' : "") + string + (this._color ? '</pre>' : "");
        this.inputsend();
      }
    },
    inputs: {
      image: {
        type: "image",
        description: "image to dither"
      },
      characters: {
        type: "string",
        description: "the characters that will be used in the conversion, dark to light",
        "default": "#MBX$PxOo=*!~-^,._ "
      },
      color: {
        type: "boolean",
        description: "each character will keep its color",
        "default": false
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
