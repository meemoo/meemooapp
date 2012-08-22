/*global Stats:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<button class="button" style="position:absolute; overflow:hidden; top:0;right:0;bottom:0;left:0; width:100%;"></button>';

  Iframework.NativeNodes["ui-button"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "button",
      description: "a button sends a bang, and you can attach a keyboard keydown"
    },
    initializeModule: function(){
      var self = this;
      this.$(".button")
        .button()
        .click(function(e){
          self.inputbang();
        });
    },
    inputbang: function(){
      this.$(".button").focus();
      this.send("bang", "!");
      return false;
    },
    inputlabel: function(label){
      this._label = label;
      if (this._key && this._key !== "") {
        label += " ("+this._key+")";
      }
      this.$(".button").button({
        label: label
      });
    },
    inputkey: function(key){
      // Unbind the old 
      if (this._key && this._key !== "") {
        Mousetrap.unbind(this._key, 'keydown');
        this._key = "";
      }
      if (key !== "") {
        var self = this;
        Mousetrap.bind(key, function(){
          self.inputbang();          
        }, 'keydown');
        this._key = key;

        // Label
        var label = "";
        if (this._label) {
          label = this._label;
        }
        label += " ("+this._key+")";
        this.$(".button").button({
          label: label
        });
      } else {
        this.$(".button").button({
          label: this._label ? this._label : " "
        });
      }
    },
    inputs: {
      bang: {
        type: "bang",
        description: "manual input bang"
      },
      label: {
        type: "string",
        description: "label for button",
        "default": ""
      },
      key: {
        type: "string",
        description: "For modifier keys you can use shift, ctrl, alt, option, meta, and command. Other special keys are backspace, tab, enter, return, capslock, esc, escape, space, pageup, pagedown, end, home, left, up, right, down, ins, and del. Can be a combination like \"shift+r\", or sequence like \"a b c\".",
        "default": ""
      }
    },
    outputs: {
      bang: {
        type: "bang"
      }
    }

  });


});
