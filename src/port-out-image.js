$(function(){

  Iframework.PortOutImage = Iframework.PortOut.extend({
    drawToCanvas: function(image) {
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
      this.context.putImageData(image, 0, 0);
      return this.canvas;
    },
    // Image out port does conversion to canvas for target native nodes 
    // and to ImageData for target iframe nodes
    send: function (message) {
      var messageType = Iframework.util.type(message);
      var self = this;
      var updatedCanvas;
      var imagedata;
      this.Edges.each(function(edge){
        _.defer(function(){
          if(edge.Target.node.view.Native && messageType==="ImageData") {
            // Send canvas ref to native nodes
            if (!updatedCanvas) {
              updatedCanvas = self.drawToCanvas(message);
            }
            edge.Target.receive(updatedCanvas);
          } else if (!edge.Target.node.view.Native && messageType==="HTMLCanvasElement") {
            // Send image data to iframe nodes
            if (!imagedata) {
              imagedata = message.getContext("2d").getImageData(0, 0, message.width, message.height);
            }
            edge.Target.receive(imagedata);
          } else {
            // Don't convert for native->native or iframe->iframe
            edge.Target.receive(message);            
          }
        });
      });
    }
  });
  
});
