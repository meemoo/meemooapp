$(function(){
  
  var template = 
    '<div class="panel">'+
      '<div class="options">'+
        '<button class="button showsource">source</button>'+
        '<button class="button showlibrary">add module</button>'+
      '</div>'+
      '<div class="source">'+
        '<button class="button close">close</button><br />'+
        '<textarea class="sourceedit" /><br />'+
        '<button class="button sourcerefresh" title="refresh the source code">refresh</button>'+
        '<button class="button sourcecompress" title="refresh and compress the source code into one line">compress</button>'+
        '<button class="button sourceapply" title="reloads the app">apply changes</button>'+
      '</div>'+
      '<div class="library">'+
        '<button class="button close">close</button>'+
        '<form class="addbyurl">'+
          '<input class="url" placeholder="load by url" type="text" />'+
          '<button type="submit">load</button>'+
        '</form>'+
      '</div>'+
    '</div>';
  
  var iframework = Backbone.View.extend({
    tagName: "div",
    className: "app",
    template: _.template(template),
    events: {
      "click .close" : "closepanels",
      "click .showsource" : "showsource",
      "click .showlibrary": "showlibrary",
      "click .sourcerefresh": "sourcerefresh",
      "click .sourcecompress": "sourcecompress",
      "click .sourceapply": "sourceapply",
    },
    initialize: function () {
      this.render();
      $('body').append(this.el);
      
      // Hide panels
      this.$(".panel .source").hide();
      this.$(".panel .library").hide();

      // Panel buttons
      this.$(".close")
        .button({ icons: { primary: 'ui-icon-close' } });
      this.$(".showsource")
        .button({ icons: { primary: 'ui-icon-gear' } });
      this.$(".showlibrary")
        .button({ icons: { primary: 'ui-icon-plus' } });
      this.$(".sourcerefresh")
        .button({ icons: { primary: 'ui-icon-arrowrefresh-1-s' } });
      this.$(".sourcecompress")
        .button({ icons: { primary: 'ui-icon-suitcase' } });
      this.$(".sourceapply")
        .button({ icons: { primary: 'ui-icon-check' } });

    },
    render: function () {
      $(this.el).html(this.template());
      return this;
    },
    shownGraph: undefined,
    // Thanks http://www.madebypi.co.uk/labs/colorutils/examples.html :: red.equal(7, true);
    wireColors: ["#FF9292", "#00C2EE", "#DCA761", "#8BB0FF", "#96BD6D", "#E797D7", "#29C6AD"],
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
      this.shownGraph = new Iframework.Graph(graph);
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
    },
    Library: null,
    addModulesToLibrary: function () {
      // This should fire after all nodes ins/outs are loaded
      if (!this.Library) {
        this.Library = new Iframework.Modules();
      }
      this.shownGraph.get("nodes").each(function(node){
        var module = this.Library.findOrAdd(node);
      }, this);
    },
    loadLibrary: function (library) {
      this.Library = library;
      Iframework.Library.each(function(module){
        module.initializeView();
        // this.$(".panel .library").append( module.view.el );
      }, this);
    },
    closepanels: function() {
      this.$(".panel .options").show();
      this.$(".panel .library").hide();
      this.$(".panel .source").hide();
    },
    showsource: function() {
      this.$(".panel .options").hide();
      this.$(".panel .library").hide();
      this.$(".panel .source").show();
      this.$(".panel .source textarea").val( JSON.stringify(Iframework.shownGraph, null, "  ") );
    },
    showlibrary: function() {
      this.$(".panel .options").hide();
      this.$(".panel .source").hide();
      this.$(".panel .library").show();
    },
    sourcerefresh: function() {
      this.$(".panel .source textarea").val( JSON.stringify(Iframework.shownGraph, null, "  ") );
    },
    sourcecompress: function() {
      this.$(".panel .source textarea").val( JSON.stringify(Iframework.shownGraph, null, "") );
    },
    sourceapply: function() {
      var newGraph = JSON.parse( $(".panel .sourceedit").val() );
      this.showGraph(newGraph);
      this.showsource();
    }

  });

  // Start app
  window.Iframework = new iframework();
  
  // Listen for /info messages from nodes
  window.addEventListener("message", Iframework.gotMessage, false);
  
  // Disable selection for better drag+drop
  // $('body').disableSelection();

});
