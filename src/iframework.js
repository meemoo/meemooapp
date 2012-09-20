$(function(){
  
  var template = 
    '<div class="showpanel">'+
      '<button class="button showload">app</button>'+
      '<button class="button showsource">source</button>'+
      '<button class="button showlibrary">module</button>'+
    '</div>'+
    '<div class="panel">'+
      '<div class="choosepanel">'+
        '<button class="button showload">app</button>'+
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
          '<button class="button newblank" title="new blank app">new</button>'+
          '<div class="currentapp">'+
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

  var currentTemplate = 
    '<h1>Current App</h1>'+
    '<div class="info">'+
      '<h2 title="url, click to edit" class="seturl editable"></h2>' +
      '<p title="title, click to edit" class="settitle editable"></p>' +
      '<p title="description, click to edit" class="setdescription editable"></p>' +
    '</div>'+
    '<div class="savecontrols">'+
      '<button class="savelocal">save local</button>'+
      '<button class="savegist" title="save app to gist.github.com anonymously">save public</button>'+
      '<button class="deletelocal">delete</button>'+
    '</div>'+
    '<div class="permalink" title="last publicly saved version">'+
    '</div>';
  
  var IframeworkView = Backbone.View.extend({
    tagName: "div",
    className: "app",
    template: _.template(template),
    currentTemplate: _.template(currentTemplate),
    frameCount: 0, // HACK to not use same name in Firefox
    NativeNodes: {},
    events: {
      "click .close" :         "closePanels",
      "click .showload" :      "showLoad",
      "click .showsource" :    "showSource",
      "click .showlibrary":    "showLibrary",
      "click .sourcerefresh":  "sourceRefresh",
      "click .sourcecompress": "sourceCompress",
      "click .sourceapply":    "sourceApply",
      "submit .addbyurl":      "addByUrl",
      "submit .loadfromgist":  "loadFromGist",
      "click .savelocal":      "saveLocal",
      "click .savegist":       "saveGist",
      "click .deletelocal":    "deleteLocal",
      "click .newblank":       "newBlank",
      // "click .saveaslocal": "saveAsLocal",
      "blur .settitle":        "setTitle",
      "blur .setdescription":  "setDescription",
      "blur .seturl":          "setUrl"
    },
    initialize: function () {
      this.render();
      $('body').prepend(this.el);
      
      // Hide panels
      this.closePanels();

      // Panel buttons
      this.$(".close")
        .button({ icons: { primary: 'icon-cancel' }, text: false });
      this.$(".showsource")
        .button({ icons: { primary: 'icon-cog' } });
      this.$(".showload")
        .button({ icons: { primary: 'icon-folder-open' } });
      this.$(".showlibrary")
        .button({ icons: { primary: 'icon-plus' } });
      this.$(".sourcerefresh")
        .button({ icons: { primary: 'icon-cw' } });
      this.$(".sourcecompress")
        .button({ icons: { primary: 'icon-bag' } });
      this.$(".sourceapply")
        .button({ icons: { primary: 'icon-ok' } });
      this.$(".addbyurlsubmit")
        .button({ icons: { primary: 'icon-ok' } });
      this.$(".loadfromgistsubmit")
        .button({ icons: { primary: 'icon-ok' } });
      this.$(".newblank")
        .button({ icons: { primary: 'icon-doc' } });

      // After all of the .js is loaded, this.allLoaded will be called to finish the init
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
      if (this.shownGraph) {
        this.shownGraph.remove();
        this.shownGraph = null;
      }
      this.wireColorIndex = 0;
      this.shownGraph = new Iframework.Graph(graph);
      if (graph["info"]["title"]) {
        document.title = "Meemoo: "+graph["info"]["title"];
      }

      this.updateCurrentInfo();
    },
    gotMessage: function (e) {
      if (Iframework.shownGraph) {
        var node = Iframework.shownGraph.get("nodes").get(e.data.nodeid);
        if (node) {
          for (var name in e.data) {
            if (e.data.hasOwnProperty(name)) {
              var info = e.data[name];
              switch (name) {
                case "message":
                  node.sendFromFrame(info);
                  break;
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
                  node.iframeLoaded();
                  break;
                case "set":
                  node.setValue(info);
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
    },
    Library: null,
    loadLibrary: function (library) {
      this.Library = new Iframework.Modules();

      var autocompleteData = [];

      var accordion = $("<div></div>");

      for (var category in library) {
        if (!library.hasOwnProperty(category)){continue;}
        var section = $('<div class="library-section"></div>');

        // section title
        section.append( $('<h3><a href="#">'+category+"</a></h3>") );

        // section items
        var sectionDiv = $("<div></div>");
        var modules = library[category];
        for (var i = 0; i<modules.length; i++) {
          var module = new Iframework.Module(modules[i]);
          this.Library.add(module);

          module.initializeView();
          sectionDiv.append(module.view.$el);

          var autocompleteDataItem = {
            value: module.get("src"),
            label: module.get("info").title + " by " + module.get("info").author + " - " + module.get("info").description + " " + module.get("src"),
            title: module.get("info").title,
            desc: module.get("info").description
          };
          autocompleteData.push(autocompleteDataItem);
        }
        section.append( sectionDiv );
        accordion.append( section );
      }

      this.$('.panel .library .listing').append(accordion);
      accordion.children(".library-section")
        .accordion({
          animated: false,
          header: "h3",
          autoHeight: false,
          collapsible: true,
          create: function(event) {
            // start closed
            $(event.target).accordion( "activate", false );
          }
        });

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
      var exampleLinks = "";
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
        } else if (!this._loadedLocal && !this._loadedLocal && !this._loadedGist) {
          // Load first example
          Iframework.loadGraph(this._exampleGraphs[0]);
        }
      }
    },
    loadExample: function (url) {
      this._loadedExample = url;
      for (var i=0; i<this._exampleGraphs.length; i++) {
        if (this._exampleGraphs[i]["info"]["url"] === url) {
          // reset localStorage version
          this._loadedLocalApp = null;
          // load graph
          this.loadGraph(this._exampleGraphs[i]);
          this.analyze("load", "example", url);
          return true;
        }
      }
    },
    closePanels: function() {
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
    showLoad: function() {
      this.showpanel();
      this.$(".panel .load").show();
    },
    showSource: function() {
      this.showpanel();
      this.$(".panel .source").show();
      this.sourceRefresh();
    },
    showLibrary: function() {
      this.showpanel();
      this.$(".panel .library").show();
    },
    sourceRefresh: function() {
      this.$(".panel .source textarea")
        .val( JSON.stringify(Iframework.shownGraph, null, "  ") );
    },
    sourceCompress: function() {
      this.$(".panel .source textarea")
        .val( JSON.stringify(Iframework.shownGraph, null, "") );
    },
    sourceApply: function() {
      try {
        var newGraph = JSON.parse( $(".panel .sourceedit textarea").val() );
        this.loadGraph(newGraph);
        this.showSource();
      } catch (e) {
        console.warn("json parse error: "+e);
      }
    },
    addByUrl: function() {
      $(".addbyurlinput").blur();
      var url = this.$(".addbyurlinput").val();
      if (url !== "") {
        var graphEl = this.$(".graph");
        this.shownGraph.addNode({
          "src": url,
          "x": graphEl.scrollLeft() + graphEl.width()/2 - 100,
          "y": graphEl.scrollTop() + graphEl.height()/2 - 100
        });
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
    loadFromGist: function () {
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
      this._loadedGist = gistid;
      // "https://gist.github.com/2439102" or just "2439102"
      var split = gistid.split("/"); // ["https:", "", "gist.github.com", "2439102"]
      if (split.length > 3 && split[2] === "gist.github.com") {
        gistid = split[3];
      }

      // Load gist to json to app
      $.ajax({
        url: 'https://api.github.com/gists/'+gistid,
        type: 'GET',
        dataType: 'jsonp'
      })
      .success( function(gistdata) {
        var graphs = [];
        for (var file in gistdata.data.files) {
          if (gistdata.data.files.hasOwnProperty(file)) {
            var graph = JSON.parse(gistdata.data.files[file].content);
            if (graph) {
              var gisturl = gistdata.data.html_url;
              // Insert a reference to the parent
              if (!graph.info.parents || !graph.info.parents.push) {
                graph.info.parents = [];
              }
              // Only if this gist url isn't already in graph's parents
              if (graph.info.parents.indexOf(gisturl) === -1) {
                graph.info.parents.push(gisturl);
              }
              graphs.push(graph);
            }
          }
        }
        if (graphs.length > 0) {
          // reset localStorage version
          this._loadedLocalApp = null;
          // load graph
          Iframework.loadGraph(graphs[0]);
          Iframework.closePanels();
        }
      })
      .error( function(e) {
        console.warn("gist load error", e);
      });

      this.analyze("load", "gist", gistid);

      return gistid;
    },
    saveGist: function () {
      // Save app to gist
      var graph = this.shownGraph.toJSON();
      var data = {
        "description": "meemoo app: "+graph["info"]["title"],
        "public": true
      };
      data["files"] = {};
      var filename = graph["info"]["url"]+".json";
      data["files"][filename] = {
        "content": JSON.stringify(graph, null, "  ")
      };

      // Button
      this.$(".savegist")
        .button({ 
          disabled: true,
          label: "saving..."
        });

      $.ajax({
        url: 'https://api.github.com/gists',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data)
      })
      .success(function(e){
        // Save gist url to graph's info.parents
        var info = Iframework.shownGraph.get("info");
        if (!info.hasOwnProperty("parents") || !info.parents.push) {
          graph.info.parents = [];
        }
        graph.info.parents.push(e.html_url);
        // Save local with new gist reference
        Iframework.saveLocal();
        // Show new permalink
        Iframework.updateCurrentInfo();

        Iframework.analyze("save", "gist", e.id);
      })
      .error(function(e){
        var description = "meemoo app: " + Iframework.shownGraph.toJSON()["info"]["title"];
        Iframework.$(".permalink").html('api is down (;_;) copy your app source code to <a href="https://gist.github.com/?description='+encodeURIComponent(description)+'" target="_blank">gist.github.com</a>');
        console.warn("gist save error", e);
      })
      .complete(function(e){
        // Button
        this.$(".savegist")
          .button({ 
            disabled: false,
            label: "save public"
          });
      });
    },
    loadLocalApps: function () {
      // Load apps from local storage
      this._localApps = new Iframework.LocalApps();
      this._localApps.fetch({
        success: function(e) {
          Iframework._localApps.each(function(app){
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
    _loadedLocal: null,
    _loadedLocalApp: null,
    loadLocal: function (url) {
      this._loadedLocal = url;
      if (this._localApps) {
        var app = this._localApps.getByUrl(url);
        if (app) {
          app.load();
          return true;
        }
        else {
          // Didn't find matching url
          console.warn("Didn't find local app with matching url.");
          this.newBlank();
          return false;
        }
      } else {
        // Local apps not loaded yet
        return false;
      }
    },
    setKey: function (current) {
      var key = window.prompt("Enter a url key", current);
      if (key) {
        key = this.encodeKey(key);
        this.shownGraph.setInfo("url", key);
      }
      return key;
    },
    encodeKey: function (key) {
      key = key.toLowerCase().replace(/ /g, "-");
      key = encodeURIComponent(key);
      return key;
    },
    saveLocal: function () {
      if (!this.shownGraph.get("info")){
        this.shownGraph.set({
          info: {}
        });
      }
      while (!this.shownGraph.get("info").hasOwnProperty("url") || this.shownGraph.get("info")["url"]==="") {
        var keysuggestion;
        if (this.shownGraph.get("info").hasOwnProperty("title") && this.shownGraph.get("info")["title"]!=="") {
          keysuggestion = this.shownGraph.get("info")["title"];
        } else {
          keysuggestion = "app-" + new Date().getTime();
        }
        if(!this.setKey(keysuggestion)){
          // cancel
          return false;
        }
      }
      var currentAppGraph = JSON.parse(JSON.stringify(this.shownGraph));
      var key = currentAppGraph["info"]["url"];
      var app;
      if (this._loadedLocalApp) {
        if (this._localApps.getByUrl(key) && this._localApps.getByUrl(key) !== this._loadedLocalApp) {
          if (window.confirm("\""+key+"\" already exists as a local app. Do you want to replace it?")) {
            app = this._localApps.updateOrCreate(currentAppGraph);
          } else {
            return false;
          }
        } else {
          // New name
          app = this._loadedLocalApp;
          app.save({graph:currentAppGraph});
          app.trigger("change");
        }
      } else {
        // Overwrite?
        if (this._localApps.getByUrl(key) && !window.confirm("\""+key+"\" already exists as a local app. Do you want to replace it?")) {
          return false;
        }
        app = this._localApps.updateOrCreate(currentAppGraph);
      }

      this._loadedLocalApp = app;

      this.analyze("save", "local", "x");

      // URL hash
      Iframework.router.navigate("local/"+key);
      return app;
    },
    deleteLocal: function () {
      if (this._loadedLocalApp) {
        this._loadedLocalApp.destroy();
        this._loadedLocalApp = null;
      }
    },
    setTitle: function () {
      var input = this.$(".currentapp .info .settitle").text();
      if (input !== this.shownGraph.get("info")["title"]) {
        this.shownGraph.setInfo("title", input);
      }
    },
    setDescription: function () {
      var input = this.$(".currentapp .info .setdescription").text();
      if (input !== this.shownGraph.get("info")["description"]) {
        this.shownGraph.setInfo("description", input);
      }
    },
    setUrl: function () {
      var input = this.$(".currentapp .info .seturl").text();
      input = this.encodeKey(input);
      if (input !== this.shownGraph.get("info")["url"]) {
        this.shownGraph.setInfo("url", input);
      }
    },
    updateCurrentInfo: function () {
      var graph = this.shownGraph.toJSON();
      this.$(".currentapp")
        .html( this.currentTemplate(graph) );
      this.$(".currentapp .savelocal")
        .button({ icons: { primary: 'icon-install' } });
      this.$(".currentapp .savegist")
        .button({ icons: { primary: 'icon-globe-1' } });
      this.$(".currentapp .deletelocal")
        .button({ icons: { primary: 'icon-trash' }, text: false });

      this.$(".currentapp .seturl")
        .text(decodeURIComponent(graph["info"]["url"]));
      this.$(".currentapp .settitle")
        .text(graph["info"]["title"]);
      this.$(".currentapp .setdescription")
        .text(graph["info"]["description"]);

      this.$(".editable")
        .attr("contenteditable", "true");

      if (graph.info.hasOwnProperty("parents")) {
        var parents = graph.info.parents;
        if (parents.length > 0) {
          var last = parents[parents.length-1];
          var split = last.split("/");
          if (split.length > 0) {
            var id = split[split.length-1];
            var gisturl = "http://meemoo.org/iframework/#gist/"+id;
            var gisturlE = encodeURIComponent(gisturl);
            var titleE = encodeURIComponent(graph["info"]["title"]);

            var gistUrlSelect = $('<span />')
              .text(gisturl)
              .click(function(e){
                // Click-to-select from http://stackoverflow.com/a/987376/592125
                var range;
                if (document.body.createTextRange) { // ms
                  range = document.body.createTextRange();
                  range.moveToElementText(e.target);
                  range.select();
                } else if (window.getSelection) {
                  var selection = window.getSelection();
                  range = document.createRange();
                  range.selectNodeContents(e.target);
                  selection.removeAllRanges();
                  selection.addRange(range);
                }
              });

            var gistLink = $('<a title="your saved gist" target="_blank" class="share icon-github"></a>')
              .attr("href", last);
            var fbLink = $('<a title="share on facebook" target="_blank" class="share icon-facebook-rect"></a>')
              .attr("href", 'https://www.facebook.com/sharer.php?u='+gisturlE+'&t='+titleE);
            var tweet = gisturl + " " + graph["info"]["title"] + " #meemoo " + graph["info"]["description"];
            // url is shortened, so can be longer than 140
            if (tweet.length >= 158) {
              tweet = tweet.substr(0,155) + "...";
            }
            var twitterLink = $('<a title="post to twitter" target="_blank" class="share icon-twitter-bird"></a>')
              .attr("href", 'https://twitter.com/intent/tweet?text='+encodeURIComponent(tweet));

            this.$(".currentapp .permalink")
              .empty()
              .append(gistUrlSelect).append(" ")
              .append(gistLink).append(" ")
              .append(fbLink)
              .append(twitterLink);
          }
        }
      }

      if (this._loadedLocalApp) {
        this.$(".currentapp .deletelocal").show();
      } else  {
        this.$(".currentapp .deletelocal").hide();
      }
    },
    newBlank: function () {
      // HACK maybe a better way to load a blank graph with defaults?
      this.loadGraph({"info":{"author":"meemoo","title":"Untitled","description":"Meemoo app description","parents":[],"url":""},"nodes":[],"edges":[]});
      // reset localStorage version
      this._loadedLocalApp = null;

      this.showLibrary();

      // URL hash
      Iframework.router.navigate("new");
    },
    analyze: function (group, type, id) {
      // Google analytics
      // _gaq.push(['_trackEvent', group, type, id]);
    }

  });

  // Start app
  window.Iframework = new IframeworkView();
  
  // Listen for /info messages from nodes
  window.addEventListener("message", Iframework.gotMessage, false);

});
