/*global Seriously:true*/

// extends src/node-box-native-view.js

$(function(){

  var template = 
    '<canvas id="canvas-<%= id %>" class="canvas" width="500" height="500" style="max-width:100%;" />'+
    '<div class="info" />';
    // '<input type="checkbox" checked="checked" class="showpreview" id="showpreview-<%= id %>" />'+
    // '<label for="showpreview-<%= id %>">show preview</label>';

  Iframework.NativeNodes["seriously"] = Iframework.NodeBoxNativeView.extend({

    template: _.template(template),
    canvas: null,
    context: null,
    _ready: false,
    // events: {
    //   "click .showpreview": "togglePreview"
    // },
    initializeCategory: function() {
      if (window.Seriously) {
        this.canvas = this.$(".canvas")[0];

        this._seriously = new Seriously();
        this.initializeModule();
      } else {
        var self = this;
        yepnope({
          load: "libs/seriously.min.js",
          complete: function () {
            self.initializeCategory();
          }
        });
      }
    },
    effectName: "",
    initializeModule: function(){
      if (this._seriously) {
        this._ready = true;
        if (this._deferStart && this._image) {
          this.inputimage(this._image);
        }
        // HACKish
        this.effectName = this.info.title;
        this._params = {};
      } else {
        // Iframework.NativeNodes["seriously"] will call initializeModule() again.
      }
    },
    // loadSeriouslyEffect: function(effect) {
    // },
    scale: function(){
      // canvas is shown at this scaling factor
      // useful for absolute positioning other elements over the canvas
      return this.$(".canvas").width() / this.canvas.width;
    },
    _deferStart: false,
    inputimage: function (image) {
      if (image !== this._image) {
        this._image = image;
      }
      if (this.canvas.width !== this._image.width || this.canvas.height !== this._image.height) {
        this.canvas.width = this._image.width;
        this.canvas.height = this._image.height;
        // TODO reset Seriously
      }
      if (this._ready) {
        if (this._effect) {
          // Render frame
          this._triggerRedraw = true;
        } else {
          this._source = this._seriously.source(this._image);
          this._target = this._seriously.target(this.canvas);
          this._effect = this._seriously.effect(this.effectName);

          this._effect.source = this._source;
          this._target.source = this._effect;
          // No Seriously.go() because Meemoo has own loop

          for (var name in this._params) {
            this._effect[name] = this._params[name];            
          }
          if (this._params["amount"]) {
            this._effect.amount = this._params["amount"];
          }

          this._triggerRedraw = true;
        }
      } else {
        this._deferStart = true;
      }
    },
    setParam: function (name, val) {
      this._params[name] = val;
      if (this._effect) {
        this._effect[name] = val;
      }
      // Render frame
      this._triggerRedraw = true;
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    redraw: function(timestamp){
      if (this._source && this._target) {
        this._source.update();
        this._target.render();
        this.inputsend();
      }
    },
    outputs: {
      image: {
        type: "image"
      }
    }
    // showCanvas: function(){
    //   $(this.canvas).attr({
    //     "class": "canvas",
    //     "id": "canvas-"+this.model.id,
    //     "style": "max-width:100%"
    //   });      
    //   this.$el.prepend(this.canvas);
    // }
    //,
    // togglePreview: function(e){
    //   if (e.target.checked) {
    //     this.$el.prepend(this.canvas);
    //   } else {
    //     this.$("canvas").remove();
    //   }
    // }

  });


});
