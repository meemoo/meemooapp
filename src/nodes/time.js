// extends src/node-box-native-view.js

$(function(){

  var template = 
    '<div class="info" />';

  Iframework.NativeNodes["time"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    initializeCategory: function() {
    },
    setupProgressbar: function(el, value) {
      this._progressbar = this.$(el)
        .progressbar({ value: value })
        .css({"height": "1em"});
      return this._progressbar;
    },
    progress: function(value) {
      if (this._progressbar) {
        this._progressbar.progressbar("value", value);
      }
    }

  });


});
