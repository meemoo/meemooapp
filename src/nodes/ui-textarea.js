/*global Stats:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<form class="textform">'+
      '<div style="position:absolute; top:2px; right:4px; bottom:30px; left:2px;">'+
        '<textarea class="text" style="width:100%; height:100%;"></textarea>'+
      '</div>'+
      '<button class="send" type="submit" style="position:absolute; bottom:0; left:0;">send</button>'+
    '</form>';

  Iframework.NativeNodes["ui-textarea"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "textarea",
      description: "a multiline text box to save and send text"
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
