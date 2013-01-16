/*global Stats:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<form class="textform">'+
      '<input type="text" class="text" style="width:90%"></input>'+
      '<button class="send" type="submit">send</button>'+
    '</form>';

  Iframework.NativeNodes["ui-text"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "text",
      description: "a text box to save and send text"
    },
    events: {
      "submit .textform": "submit"
    },
    initializeModule: function(){
      this.$(".button").button();
    },
    submit: function(){
      this._val = this.$(".text").val();
      this.inputsend();
      return false;
    },
    inputvalue: function(val){
      this._val = val;
      this.$(".text").val(val);
      this.inputsend();
    },
    inputsend: function(){
      this.send("string", this._val);
    },
    inputs: {
      value: {
        type: "string",
        description: "manual input of text"
      },
      send: {
        type: "bang",
        description: "send the text"
      }
    },
    outputs: {
      string: {
        type: "string"
      }
    }

  });


});
