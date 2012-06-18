$(function(){
  
  var template = 
    '<div class="showpanel">'+
      '<button class="button showload">file</button>'+
      '<button class="button showsource">source</button>'+
      '<button class="button showlibrary">module</button>'+
    '</div>'+
    '<div class="panel">'+
      '<div class="choosepanel">'+
        '<button class="button showload">file</button>'+
        '<button class="button showsource">source</button>'+
        '<button class="button showlibrary">module</button>'+
        '<button class="button close">close</button>'+
      '</div>'+
      '<div class="load">'+
        '<div class="controls">'+
          '<form class="loadfromgist">'+
            '<input class="loadfromgistinput" name="loadfromgistinput" placeholder="load app from gist url" type="text" />'+
            '<button class="loadfromgistsubmit" type="submit">load</button>'+
          '</form>'+
        '</div>'+
        '<div class="listing">'+
          '<div class="currentapp">'+
            '<h1>Current</h1>'+
            '<button class="savelocal">save</button>'+
            '<button class="saveaslocal">save as</button>'+
          '</div>'+
          '<div class="localapps">'+
            '<h1>Saved Apps</h1>'+
          '</div>'+
          '<div class="examples">'+
            '<h1>Examples</h1>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="source">'+
        '<div class="sourceedit">'+
          '<textarea />'+
        '</div>'+
        '<div class="controls">'+
          '<button class="button sourcerefresh" title="refresh the source code">refresh</button>'+
          '<button class="button sourcecompress" title="refresh and compress the source code into one line">compress</button>'+
          '<button class="button sourceapply" title="reloads the app">apply changes</button>'+
        '</div>'+
      '</div>'+
      '<div class="library">'+
        '<div class="controls">'+
          '<form class="addbyurl">'+
            '<input class="addbyurlinput" name="addbyurlinput" placeholder="search or url" type="text" />'+
            '<button class="addbyurlsubmit" type="submit">load</button>'+
          '</form>'+
        '</div>'+
        '<div class="listing">'+
        '</div>'+
      '</div>'+
    '</div>';
  
  var IframeworkView = Backbone.View.extend({
    tagName: "div",
    className: "app",
    template: _.template(template),
    frameCount: 0, // HACK to not use same name in Firefox
    events: {
      "click .close" :         "closepanels",
      "click .showload" :      "showload",
      "click .showsource" :    "showsource",
      "click .showlibrary":    "showlibrary",
      "click .sourcerefresh":  "sourcerefresh",
      "click .sourcecompress": "sourcecompress",
      "click .sourceapply":    "sourceapply",
      "submit .addbyurl":      "addbyurl",
      "submit .loadfromgist":  "loadfromgist",
      "click .savelocal":      "savelocal",
      "click .saveaslocal":    "saveaslocal"
    },
    initialize: function () {
      this.render();
      $('body').append(this.el);
      
      // Hide panels
      this.$(".panel .source").hide();
      this.$(".panel .library").hide();

      // Panel buttons
      this.$(".close")
        .button({ icons: { primary: 'ui-icon-close' }, text: false });
      this.$(".showsource")
        .button({ icons: { primary: 'ui-icon-gear' } });
      this.$(".showload")
        .button({ icons: { primary: 'ui-icon-folder-open' } });
      this.$(".showlibrary")
        .button({ icons: { primary: 'ui-icon-plus' } });
      this.$(".sourcerefresh")
        .button({ icons: { primary: 'ui-icon-arrowrefresh-1-s' } });
      this.$(".sourcecompress")
        .button({ icons: { primary: 'ui-icon-suitcase' } });
      this.$(".sourceapply")
        .button({ icons: { primary: 'ui-icon-check' } });
      this.$(".addbyurlsubmit")
        .button({ icons: { primary: 'ui-icon-check' } });
      this.$(".loadfromgistsubmit")
        .button({ icons: { primary: 'ui-icon-check' } });
      this.$(".savelocal")
        .button({ icons: { primary: 'ui-icon-disk' } });
      this.$(".saveaslocal")
        .button({ icons: { primary: 'ui-icon-disk' } });

    },
    allLoaded: function () {
      this.loadLocalApps();
    },
    render: function () {
      this.$el.html(this.template());
      return this;
    },
    shownGraph: null,
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
    loadGraph: function (graph) {
      if (this.shownGraph && this.shownGraph.view) {
        this.shownGraph.view.$el.remove();
        this.shownGraph.view = null;
        this.shownGraph = null;
      }
      this.wireColorIndex = 0;
      this.shownGraph = new Iframework.Graph(graph);
      if (graph["info"]["title"]) {
        document.title = "Meemoo: "+graph["info"]["title"];
      }
      this.closepanels();
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
          $('<div class="iframemask" />')
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
      var autocompleteData = [];
      Iframework.Library.each(function(module){
        module.initializeView();
        // this.$(".panel .library").append( module.view.el );
        var autocompleteDataItem = {
          value: module.get("src"),
          label: module.get("info").title + " by " + module.get("info").author + " - " + module.get("info").description + " " + module.get("src"),
          title: module.get("info").title,
          desc: module.get("info").description
        };
        autocompleteData.push(autocompleteDataItem);
      }, this);

      this.$('.addbyurlinput')
        .autocomplete({
          minLength: 1,
          source: autocompleteData
        })
        .data( "autocomplete" )._renderItem = function( ul, item ) {
          return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( '<a title="'+item.value+'"><span class="autocomplete-title">' + item.title + '</span><br /><span class="autocomplete-desc">' + item.desc + "</span></a>" )
            .appendTo( ul );
        };
    },
    _exampleGraphs: [],
    _loadedExample: null,
    loadExampleApps: function (examples) {
      this._exampleGraphs = this._exampleGraphs.concat(examples);

      // Make example links:
      var exampleLinks = "examples: <br /> ";
      for (var i=0; i<examples.length; i++) {
        var url = examples[i]["info"]["url"];
        if (url) {
          exampleLinks += '<a href="#example/'+url+'" title="'+examples[i]["info"]["title"]+": "+examples[i]["info"]["description"]+'">'+url+'</a> <br />';
        }
      }
      this.$(".panel .load .examples").append(exampleLinks);

      // None shown
      if (!this.shownGraph){
        if (this._loadedExample) {
          // Router tried to load this already, try again
          this.loadExample(this._loadedExample);
        } else if (!this._loadedLocal) {
          // Load first example
          Iframework.loadGraph(this._exampleGraphs[0]);
        }
      }
    },
    loadExample: function (url) {
      this._loadedExample = url;
      for (var i=0; i<this._exampleGraphs.length; i++) {
        if (this._exampleGraphs[i]["info"]["url"] === url) {
          this.loadGraph(this._exampleGraphs[i]);
          return true;
        }
      }
    },
    closepanels: function() {
      this.$(".showpanel").show();
      this.$(".panel").hide();
      this.$(".graph").css("right", "0px");

      this.$(".panel .load").hide();
      this.$(".panel .library").hide();
      this.$(".panel .source").hide();
    },
    showpanel: function() {
      this.$(".panel .load").hide();
      this.$(".panel .library").hide();
      this.$(".panel .source").hide();

      this.$(".showpanel").hide();
      this.$(".panel").show();
      this.$(".graph").css("right", "350px");
    },
    showload: function() {
      this.showpanel();
      this.$(".panel .load").show();
    },
    showsource: function() {
      this.showpanel();
      this.$(".panel .source").show();
      this.sourcerefresh();
    },
    showlibrary: function() {
      this.showpanel();
      this.$(".panel .library").show();
    },
    sourcerefresh: function() {
      this.$(".panel .source textarea")
        .val( JSON.stringify(Iframework.shownGraph, null, "  ") );
    },
    sourcecompress: function() {
      this.$(".panel .source textarea")
        .val( JSON.stringify(Iframework.shownGraph, null, "") );
    },
    sourceapply: function() {
      var newGraph = JSON.parse( $(".panel .sourceedit textarea").val() );
      this.loadGraph(newGraph);
      this.showsource();
    },
    addbyurl: function() {
      $(".addbyurlinput").blur();
      var url = this.$(".addbyurlinput").val();
      if (url !== "") {
        this.shownGraph.addNode( new Iframework.NodeBoxIframe({"src": url}) );
        this.$(".addbyurlinput")
          .val("")
          .attr("placeholder", "loading...");
        window.setTimeout(function(){
          this.$(".addbyurlinput")
            .attr("placeholder", "search or url");
        },1000);
      }
      return false;
    },
    loadfromgist: function () {
      var gistid = this.loadFromGistId( this.$(".loadfromgistinput").val() );
      if ( gistid ) {
        $(".loadfromgistinput").blur();

        if (this.router) {
          this.router.navigate("gist/"+gistid);
        }

        // Input placeholder
        this.$(".loadfromgistinput")
          .val("")
          .attr("placeholder", "loading...");
        window.setTimeout(function(){
          this.$(".loadfromgistinput")
            .attr("placeholder", "load app from gist url");
        }, 1500);

      }

      return false;
    },
    loadFromGistId: function (gistid) {
      // "https://gist.github.com/2439102" or just "2439102"
      var split = gistid.split("/"); // ["https:", "", "gist.github.com", "2439102"]
      if (split.length > 3 && split[2] === "gist.github.com") {
        gistid = split[3];
      }
      gistid = parseInt(gistid, 10);
      if (gistid !== gistid) {
        // NaN
        return false;
      }

      // Load gist to json to app
      $.ajax({
        url: 'https://api.github.com/gists/'+gistid,
        type: 'GET',
        dataType: 'jsonp'
      }).success( function(gistdata) {
        var graphs = [];
        for (var file in gistdata.data.files) {
          if (gistdata.data.files.hasOwnProperty(file)) {
            var graph = JSON.parse(gistdata.data.files[file].content);
            var gisturl = gistdata.data.html_url;
            // Insert a reference to the parent
            if (!graph.info.parents || !graph.info.parents.push) {
              graph.info.parents = [];
            }
            // Only if this gist url isn't already in graph's parents
            if (graph.info.parents.indexOf(gisturl) === -1) {
              graph.info.parents.push(gisturl);
            }
            if (graph) {
              graphs.push(graph);
            }
          }
        }
        if (graphs.length > 0) {
          Iframework.loadGraph(graphs[0]);
          Iframework.closepanels();
        }
      }).error( function(e) {
        console.warn("gist load error", e);
      });

      return gistid;
    },
    loadLocalApps: function () {
      // Load apps from local storage
      this._localapps = new Iframework.LocalApps();
      this._localapps.fetch({
        success: function(e) {
          Iframework._localapps.each(function(app){
            app.initializeView();
          });
          // None shown
          if (!Iframework.shownGraph){
            if (Iframework._loadedLocal) {
              // Router tried to load this already, try again
              Iframework.loadLocal(Iframework._loadedLocal);
            }
          }
        },
        error: function (e) {
          console.warn("error loading local apps");
        }
      });
    },
    loadLocal: function (url) {
      this._loadedLocal = url;
      if (this._localapps) {
        var app = this._localapps.find(function(app){
          return app.get("graph")["info"]["url"] === url;
        });
        if (app) {
          this.loadGraph(app.get("graph"));
          return true;
        }
        else {
          // Didn't find matching url
          return false;
        }
      } else {
        // Local apps not loaded yet
        return false;
      }
    },
    setkey: function () {
      var key = window.prompt("Enter a url key");
      key = key.toLowerCase().replace(" ", "-");
      key = encodeURIComponent(key);
      this.shownGraph.setInfo("url", key);
    },
    savelocal: function () {
      if (!this.shownGraph.get("info")){
        this.shownGraph.set({
          info: {}
        });
      }
      while (!this.shownGraph.get("info").hasOwnProperty("url") || this.shownGraph.get("info")["url"]==="") {
        this.setkey();
      }
      var currentAppGraph = JSON.parse(JSON.stringify(this.shownGraph));
      var app = this._localapps.updateOrCreate(currentAppGraph);
      var key = currentAppGraph["info"]["url"];
      Iframework.router.navigate("local/"+key);
    },
    saveaslocal: function () {
      this.setkey();
      this.savelocal();
    }


  });

  // Start app
  window.Iframework = new IframeworkView();
  
  // Listen for /info messages from nodes
  window.addEventListener("message", Iframework.gotMessage, false);

});
