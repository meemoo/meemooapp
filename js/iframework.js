$(function(){

  window.Iframework = {
    shownGraph: undefined,
    // Thanks http://www.madebypi.co.uk/labs/colorutils/examples.html red.equal(10, true);
    wireColors: ["#FF0000", "#5B8E00", "#00A189", "#0097FF", "#DF05E1", "#BE6C00", "#009C00", "#00A1F3", "#0073FF", "#FF0078"],
    wireColorIndex: 0,
    selectedPort: null,
    getWireColor: function () {
      var color = this.wireColors[this.wireColorIndex];
      this.wireColorIndex++;
      if (this.wireColorIndex > this.wireColors.length-1) {
        this.wireColorIndex = 0;
      }
      return color;
    },
    showGraph: function (graph) {
      if (this.shownGraph && this.shownGraph.view) {
        $(this.shownGraph.view.el).remove();
        this.shownGraph.view = null;
        this.shownGraph = null;
      }
      this.shownGraph = new window.Iframework.Graph(graph);
      this.wireColorIndex = 0;
    },
    gotMessage: function (e) {
      if (Iframework.shownGraph) {
        var node = Iframework.shownGraph.get("nodes").get(e.data.nodeid);
        if (node) {
          for (var name in e.data) {
            if (e.data.hasOwnProperty(name)) {
              var info = e.data[name];
              switch (name) {
                case "info":
                  node.infoLoaded(info);
                  break;
                case "addInput":
                  node.addInput(info);
                  break;
                case "addOutput":
                  node.addOutput(info);
                  break;
                case "stateReady":
                  node.stateReady();
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
    },
    maskFrames: function () {
      $(".module").each(function(){
        $(this).append(
          $('<div class="iframemask" />').css({
            "width": $(this).children(".frame").width()+2,
            "height": $(this).children(".frame").height()+2
          })
        );
      });
    },
    unmaskFrames: function () {
      $(".iframemask").remove();
    }
  };
  
  // Listen for /info messages from nodes
  window.addEventListener("message", window.Iframework.gotMessage, false);
  
  // Disable selection for better drag+drop
  // $('body').disableSelection();

});
