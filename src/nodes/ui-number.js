/*global Stats:true*/

// extends src/nodes/time.js which extends src/node-box-native-view.js

$(function(){

  var template = 
    '<form class="textform">'+
      '<label><span class="label"></span> '+
        '<input type="number" class="number" style="width:90%"></input>'+
      '</label>'+
      '<button class="send" type="submit">send</button>'+
    '</form>';

  Iframework.NativeNodes["ui-number"] = Iframework.NativeNodes["ui"].extend({

    template: _.template(template),
    info: {
      title: "number",
      description: "a number box to save and send int/float"
    },
    events: {
      "submit .textform": "submit"
    },
    initializeModule: function(){
    },
    submit: function(){
      this._val = parseFloat( this.$(".number").val() );
      this.inputsend();
      return false;
    },
    inputvalue: function(val){
      this._val = val;
      this.inputsend();
      this._triggerRedraw = true;
    },
    inputlabel: function(label){
      this.$(".label").text(label);
    },
    inputsend: function(){
      this.send("number", this._val);
    },
    redraw: function(timestamp){
      this.$(".number").val( this._val );
    },
    inputs: {
      value: {
        type: "float",
        description: "default number"
      },
      label: {
        type: "string",
        description: "label for input"
      },
      send: {
        type: "bang",
        description: "send the text"
      }
    },
    outputs: {
      number: {
        type: "float"
      }
    }

  });


});
