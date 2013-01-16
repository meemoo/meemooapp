/*global Stats:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = '<input type="checkbox" class="check" style="width:3em;height:3em;"></input>';

  Iframework.NativeNodes["ui-checkbox"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "checkbox",
      description: "a checkbox to send boolean on/off"
    },
    events: {
      "change .check": "check"
    },
    initializeModule: function(){
      this.$(".button").button();
    },
    check: function(){
      this._val = this.$(".check").prop("checked");
      this.inputsend();
    },
    inputvalue: function(val){
      this._val = val;
      this.$(".check").prop("checked", this._val);
      this.inputsend();
    },
    inputon: function(){
      this._val = true;
      this.$(".check").prop("checked", this._val);
      this.inputsend();
    },
    inputoff: function(){
      this._val = false;
      this.$(".check").prop("checked", this._val);
      this.inputsend();
    },
    inputtoggle: function(){
      this._val = !this._val;
      this.$(".check").prop("checked", this._val);
      this.inputsend();
    },
    inputsend: function(){
      this.send("checked", this._val);
      if (this._val) {
        this.send("on", "!");
      } else {
        this.send("off", "!");
      }
    },
    inputs: {
      value: {
        type: "boolean",
        description: "initial value"
      },
      on: {
        type: "bang"
      },
      off: {
        type: "bang"
      },
      toggle: {
        type: "bang",
        description: "toggle on/off"
      },
      send: {
        type: "bang",
        description: "send the boolean"
      }
    },
    outputs: {
      checked: {
        type: "boolean"
      },
      on: {
        type: "bang"
      },
      off: {
        type: "bang"
      }
    }

  });


});
