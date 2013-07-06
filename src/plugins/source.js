$( function() {

  var template = $(
    '<div>'+
      '<div class="sourceedit">'+
        '<textarea />'+
      '</div>'+
      '<div class="controls">'+
        '<button class="button sourcerefresh icon-cw" title="refresh the source code">refresh</button>'+
        '<button class="button sourcecompress icon-bag" title="refresh and compress the source code into one line">compress</button>'+
        '<button class="button sourceapply icon-ok" title="reloads the app">apply changes</button>'+
      '</div>'+
    '</div>'
  );

  var code = template.find("textarea");

  // Add menu
  Iframework.addMenu("source", template, "icon-cog");

  // On change update code view
  Iframework.on("change", function(graph){
    if (Iframework.graph && Iframework.$(".menu-source").is(":visible")) {
      // Bookmark to scroll back to
      var scrollBackTop = code.prop("scrollTop");
      code.val( JSON.stringify(Iframework.graph.toJSON(), null, "  ") );
      code.scrollTop( scrollBackTop );
    }
  });

  var sourceRefresh = function(){
    code.val( JSON.stringify(Iframework.graph, null, "  ") );
  };
  template.find(".sourcerefresh").click(sourceRefresh);

  // On show manu update source
  Iframework.on("showmenu:source", sourceRefresh);

  var sourceCompress = function(){
    code.val( JSON.stringify(Iframework.graph, null, "") );
  };
  template.find(".sourcecompress").click(sourceCompress);

  // Apply source to test graph
  var sourceApply = function(){
    //   try {
    //     var newGraph = JSON.parse( this.$(".sourceedit textarea").val() );
    //     this.loadGraph(newGraph);
    //     this.showSource();
    //     // reset localStorage version
    //     this._loadedLocalApp = null;
    //   } catch (e) {
    //     console.warn("json parse error: "+e);
    //   }
    var graph;
    try {
      graph = JSON.parse( code.val() );
    } catch(error){
      return false;
    }
    if (graph) {
      var g = Iframework.loadGraph(graph);
      // reset localStorage version
      Iframework._loadedLocalApp = null;
      sourceRefresh();
      g.trigger("change");
    }
    return false;
  };
  template.find(".sourceapply").click(sourceApply);

} );
