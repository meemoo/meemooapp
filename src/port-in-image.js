$(function(){

  Iframework.PortInImage = Iframework.PortIn.extend({
  // Iframework.PortIn = Iframework.Port.extend({
    defaults: {
      name: "",
      type: "",
      description: "",
      "default": null
    },
    initializeView: function () {
      return this.view = new Iframework.PortInView({model:this});
    },
    getCanvas: function(image) {
      if (!this.canvas) {
        // Make internal canvas to pass
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext('2d');
      }
      if (this.canvas.width !== image.width || this.canvas.height !== image.height) {
        // Resize if needed
        this.canvas.width = image.width;
        this.canvas.height = image.height;
      }
      return this.canvas;
    },
    putImageDataToCanvas: function(image) {
      this.getCanvas(image);
      this.context.putImageData(image, 0, 0);
      return this.canvas;
    },
    drawToCanvas: function(image) {
      this.getCanvas(image);
      this.context.drawImage(image, 0, 0);
      return this.canvas;
    },
    // Input ports get message
    receive: function (message) {
      // Type conversions
      var messageType = Iframework.util.type(message);
      var self = this;
      var updatedCanvas;
      var updatedCanvas2;
      var imagedata;
      if (this.node.view.Native && messageType==="ImageData") {
        // Make canvas
        if (!updatedCanvas) {
          updatedCanvas = self.putImageDataToCanvas(message);
        }
        message = updatedCanvas2;
      } else if (!this.node.view.Native && messageType!=="ImageData") {
        // Get image data
        if (!message.getContext || !message.getContext("2d")) {
          // Video or WebGL?
          if (!updatedCanvas2) {
            updatedCanvas2 = this.drawToCanvas(message);
            message = updatedCanvas2;
          }
        }
        // Send image data to iframe nodes
        if (!imagedata) {
          imagedata = message.getContext("2d").getImageData(0, 0, message.width, message.height);
        }
        message = imagedata;
      }
      var m = {};
      m[this.id] = message;
      this.node.receive(m); 
    }
  });
  
  Iframework.PortsIn = Backbone.Collection.extend({
    model: Iframework.PortIn
  });

});
