$(function(){

  Iframework.PortOutImage = Iframework.PortOut.extend({
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
    // Image out port does conversion to canvas for target native nodes 
    // and to ImageData for target iframe nodes
    send: function (message) {
      var messageType = Iframework.util.type(message);
      var self = this;
      var updatedCanvas;
      var updatedCanvas2;
      var imagedata;
      this.Edges.each(function(edge){
        _.defer(function(){
          if(edge.Target.node.view.Native && messageType==="ImageData") {
            // Send canvas ref to native nodes
            if (!updatedCanvas) {
              updatedCanvas = self.putImageDataToCanvas(message);
            }
            edge.Target.receive(updatedCanvas);
          } else if (!edge.Target.node.view.Native && messageType!=="ImageData") {
            if (!message.getContext || !message.getContext("2d")) {
              // Video or WebGL?
              if (!updatedCanvas2) {
                updatedCanvas2 = self.drawToCanvas(message);
                message = updatedCanvas2;
              }
            }
            // Send image data to iframe nodes
            if (!imagedata) {
              imagedata = message.getContext("2d").getImageData(0, 0, message.width, message.height);
            }
            edge.Target.receive(imagedata);
          // } else if (!message.getContext("2d")) {
          //   // Video or WebGL?
          //   if (!updatedCanvas) {
          //     updatedCanvas = self.drawToCanvas(message);
          //   }
          //   edge.Target.receive(updatedCanvas);
          } else {
            // Don't convert for native->native or iframe->iframe
            edge.Target.receive(message);            
          }
        });
      });
    }
  });
  
});
