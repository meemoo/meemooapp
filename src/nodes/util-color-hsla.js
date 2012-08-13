// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="samplebg" style="background-image: url(img/alphabg.png); display: inline-block; width: 100px; height: 100px;">'+
      '<div class="sample" style="display: inline-block; width: 100px; height: 100px;"></div>'+
    '</div>'+
    '<div class="info">...</div>';

  Iframework.NativeNodes["util-color-hsla"] = Iframework.NativeNodes["util"].extend({

    template: _.template(template),
    info: {
      title: "color-hsla",
      description: "make hsla() css color (hue, saturation, lightness, alpha)"
    },
    initializeModule: function(){
      this.sampleEl = this.$(".sample");
      this.infoEl = this.$(".info");
    },
    inputhue: function (f) {
      if (f<0.00000001) {
        // js color doesn't like 1e-9 hue
        f = 0;
      }
      this._hue = f;

      this._triggerRedraw = true;
    },
    _color: "",
    redraw: function(timestamp){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      var newColor = "hsla("+(this._hue*360).toFixed(3)+", "+(this._saturation*100)+"%, "+(this._lightness*100)+"%, "+this._alpha+")";
      if (this._color !== newColor) {
        this._color = newColor;
        this.sampleEl.css({"background-color": this._color});
        this.infoEl.text(this._color);
      }
      this.inputsend();
    },
    inputsend: function () {
      this.send("color", this._color);
    },
    inputs: {
      hue: {
        type: "float",
        description: "hue value, 0-1 (translated to 0-360)",
        "default": 0
      },
      saturation: {
        type: "float",
        description: "saturation value, 0-1",
        "default": 1
      },
      lightness: {
        type: "float",
        description: "lightness value, 0-1",
        "default": 0.5
      },
      alpha: {
        type: "float",
        description: "alpha value, 0-1",
        "default": 1
      }
    },
    outputs: {
      color: {
        type: "color:hsla"
      }
    }

  });


});
