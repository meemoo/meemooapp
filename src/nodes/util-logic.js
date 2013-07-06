// extends src/nodes/util.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["util-logic"] = Iframework.NativeNodes["util"].extend({

    info: {
      title: "logic",
      description: "greater than (>) less than (<) equal (==) not equal (!=) logic"
    },
    initializeModule: function(){
    },
    inputnumber1: function(n){
      this._number1 = n;
      this.test();
    },
    inputnumber2: function(n){
      this._number2 = n;
      this.test();
    },
    inputlogic: function(l){
      if (l==="="){
        l = "==";
        this.set("logic", "==");
      }
      if (l===">" || l===">=" || l==="<" || l==="<=" || l==="==" || l==="!=") {
        this._logic = l;
        this.test();
      }
    },
    _result: false,
    test: function() {
      switch (this._logic) {
        case ">":
          this._result = (this._number1 > this._number2);
          break;
        case ">=":
          this._result = (this._number1 >= this._number2);
          break;
        case "<":
          this._result = (this._number1 < this._number2);
          break;
        case "<=":
          this._result = (this._number1 <= this._number2);
          break;
        case "==":
          this._result = (this._number1 == this._number2);
          break;
        case "!=":
          this._result = (this._number1 != this._number2);
          break;
        default:
          break;
      }
      this.send("boolean", this._result);
      if (this._result) {
        this.send("true", "!");
      } else {
        this.send("false", "!");
      }
      this._triggerRedraw = true;
    },
    redraw: function(timestamp){
      this.$(".info").text( this._number1 + " " + this._logic + " " + this._number2 + " " + this._result );
    },
    inputs: {
      number1: {
        type: "float",
        description: "number to compare",
        "default": 0
      },
      number2: {
        type: "float",
        description: "number to compare",
        "default": 0
      },
      logic: {
        type: "string",
        description: "> (greater than), >=, < (less than), <=, == (equal), != (not equal)",
        options: "> >= < <= == !=".split(" "),
        "default": "=="
      }
    },
    outputs: {
      "boolean": {
        type: "boolean"
      },
      "true": {
        type: "bang"
      },
      "false": {
        type: "bang"
      }
    }

  });


});
