$(function(){
  
  var template = 
    '<div class="showpanel">'+
      '<button class="button show-load icon-folder-open">app</button>'+
    '</div>'+
    '<div class="panel">'+
      '<div class="choosepanel">'+
        '<button class="button show-load icon-folder-open">app</button>'+
        '<button class="button close icon-cancel" title="close menu"></button>'+
      '</div>'+
      '<div class="menu menu-load">'+
        '<div class="controls">'+
          '<form class="loadfromgist">'+
            '<input class="loadfromgistinput" name="loadfromgistinput" placeholder="load app from gist url" type="text" />'+
            '<button class="loadfromgistsubmit icon-ok" type="submit">load</button>'+
          '</form>'+
        '</div>'+
        '<div class="listing">'+
          '<button class="button newblank icon-doc" title="new blank app">new</button>'+
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
    '</div>';

  var currentTemplate = 
    '<h1>Current App</h1>'+
    '<div class="info">'+
      '<h2 title="url, click to edit" class="seturl editable"></h2>' +
      '<p title="title, click to edit" class="settitle editable"></p>' +
      '<p title="description, click to edit" class="setdescription editable"></p>' +
    '</div>'+
    '<div class="savecontrols">'+
      '<button class="savelocal icon-install">save local</button>'+
      '<button class="forklocal icon-split" title="save as... copy app and save under a new name">fork</button>'+
      '<button class="savegist icon-globe-1" title="save app to gist.github.com anonymously">save public</button>'+
      '<button class="deletelocal icon-trash" title="delete local app"></button>'+
    '</div>'+
    '<div class="permalink" title="last publicly saved version">'+
    '</div>';

  // requestAnimationFrame shim from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     || 
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
  }());    
  
  var IframeworkView = Backbone.View.extend({
    tagName: "div",
    className: "app",
    template: _.template(template),
    currentTemplate: _.template(currentTemplate),
    frameCount: 0, // HACK to not use same name in Firefox
    NativeNodes: {},
    plugins: {},
    events: {
      "click .close" :         "closePanels",
      "click .show-load" :      "showLoad",

      "click .newblank":       "newBlank",

      "submit .loadfromgist":  "loadFromGist",
      "click .savegist":       "saveGist",
      "click .savelocal":      "saveLocal",
      "click .forklocal":      "forkLocal",
      "click .deletelocal":    "deleteLocal",

      "blur .settitle":        "setTitle",
      "blur .setdescription":  "setDescription",
      "blur .seturl":          "setUrl"
    },
    initialize: function () {
      this.render();
      $('body').prepend(this.el);
      
      // Hide panels
      this.closePanels();

      // After all of the .js is loaded, this.allLoaded will be triggered to finish the init
      this.once("allLoaded", this.loadLocalApps, this);
    },
    allLoaded: function () {
      this.trigger("allLoaded");

      // Start animation loop
      window.requestAnimationFrame( this.renderAnimationFrame.bind(this) );
    },
    render: function () {
      this.$el.html(this.template());
      return this;
    },
    renderAnimationFrame: function (timestamp) {
      // Safari doesn't pass timestamp
      timestamp = timestamp !== undefined ? timestamp : Date.now();
      // Queue next frame
      window.requestAnimationFrame( this.renderAnimationFrame.bind(this) );
      // Hit graph, which hits nodes
      if (this.graph && this.graph.view) {
        this.graph.view.renderAnimationFrame(timestamp);
      }
    },
    graph: null,
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
    addMenu: function(name, html, icon){
      var self = this;

      var menu = $('<div class="menu menu-'+name+'"></div>')
        .append(html)
        .hide();
      this.$(".panel").append(menu);

      var showButton = $('<button class="button show-'+name+'">'+name+'</button>')
        .click( function(){
          self.showPanel(name);
          // menu.show();
        });
      if (icon) {
        showButton.addClass(icon);
      }
      this.$(".showpanel").append(showButton);
      this.$(".choosepanel > .close").before(showButton.clone(true));
    },
    addMenuSection: function(name, html, parentMenu){
      var title = $("<h1>").text(name);
      this.$(".menu-"+parentMenu+" .listing").append(title, html);
    },
    loadGraph: function (graph) {
      // Load a new parent graph

      if (this.graph) {
        this.graph.remove();
        this.graph = null;
      }
      this.wireColorIndex = 0;
      this.graph = new Iframework.Graph(graph);
      if (graph["info"] && graph["info"]["title"]) {
        document.title = "Meemoo: "+graph["info"]["title"];
      }

      this.updateCurrentInfo();

      this.shownGraph = this.graph;

      return this.graph;
    },
    showGraph: function (graph) {
      // Show a child graph / subgraph / macro
      if (this.shownGraph && this.shownGraph.view) {
        this.shownGraph.view.$el.hide();
      }
      if (!graph.view) {
        graph.initializeView();
      }
      this.shownGraph = graph;
      this.shownGraph.view.$el.show();
      // Rerender edges once
      if (!this.shownGraph.view.unhidden) {
        this.shownGraph.view.unhidden = true;
        this.shownGraph.view.rerenderEdges();
      }
    },
    gotMessage: function (e) {
      if (Iframework.graph) {
        var node = Iframework.graph.get("nodes").get(e.data.nodeid);
        // TODO: iframes in subgraphs?
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
                  node.setValues(info);
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
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
      this.$(".menu-load .examples").append(exampleLinks);

      // None shown
      if (!this.graph){
        if (this._loadedExample) {
          // Router tried to load this already, try again
          this.loadExample(this._loadedExample);
        } else if (!this._loadedLocal && !this._loadedLocal && !this._loadedGist) {
          // Load first example
          // Iframework.loadGraph(this._exampleGraphs[0]);
          // Load new graph
          this.newBlank();
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

      this.$(".menu").hide();
    },
    showPanel: function( menu ) {
      this.$(".menu").hide();

      this.$(".showpanel").hide();
      this.$(".panel").show();
      this.$(".graph").css("right", "350px");

      if (menu) {
        if ( this.$(".menu-"+menu).length > 0 ) {
          this.$(".menu-"+menu).show();
          this.trigger("showmenu:"+menu);
        } else {
          // HACK for when menu plugin isn't added yet
          var self = this;
          _.delay(function(){
            self.$(".menu-"+menu).show();
            self.trigger("showmenu:"+menu);
          }, 1000);
        }
      }
    },
    showLoad: function() {
      this.showPanel();
      this.$(".menu-load").show();
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
        gistid = split[split.length-1];
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
          // FIXME
          // Iframework._loadedLocalApp = null;
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
      var graph = this.graph.toJSON();
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
        .prop('disabled', true)
        .text("saving...");

      $.ajax({
        url: 'https://api.github.com/gists',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data)
      })
      .success(function(e){
        // Save gist url to graph's info.parents
        var info = Iframework.graph.get("info");
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
        var description = "meemoo app: " + Iframework.graph.toJSON()["info"]["title"];
        Iframework.$(".permalink").html('api is down (;_;) copy your app source code to <a href="https://gist.github.com/?description='+encodeURIComponent(description)+'" target="_blank">gist.github.com</a>');
        console.warn("gist save error", e);
      })
      .complete(function(e){
        // Button
        this.$(".savegist")
          .prop('disabled', false)
          .text("save public");
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
          if (!Iframework.graph){
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
        this.graph.setInfo("url", key);
      }
      return key;
    },
    encodeKey: function (key) {
      key = key.toLowerCase().replace(/ /g, "-");
      key = encodeURIComponent(key);
      return key;
    },
    saveLocal: function () {
      if (!this.graph.get("info")){
        this.graph.set({
          info: {}
        });
      }
      while (!this.graph.get("info").hasOwnProperty("url") || this.graph.get("info")["url"]==="") {
        var keysuggestion;
        if (this.graph.get("info").hasOwnProperty("title") && this.graph.get("info")["title"]!=="") {
          keysuggestion = this.graph.get("info")["title"];
        } else {
          keysuggestion = "app-" + new Date().getTime();
        }
        if(!this.setKey(keysuggestion)){
          // cancel
          return false;
        }
      }
      var currentAppGraph = JSON.parse(JSON.stringify(this.graph));
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

      // To show when url changes
      this.updateCurrentInfo();

      // URL hash
      Iframework.router.navigate("local/"+key);
      return app;
    },
    forkLocal: function(){
      // This makes it save the app as a new local app
      this._loadedLocalApp = null;
      // Suggested name
      var url = this.graph.get("info")["url"]+"-copy";
      this.setKey(url);
      // Do the overwrite checks and save
      this.saveLocal();
    },
    deleteLocal: function () {
      if (this._loadedLocalApp) {
        this._loadedLocalApp.destroy();
        this._loadedLocalApp = null;
      }
    },
    setTitle: function () {
      var input = this.$(".currentapp .info .settitle").text();
      if (input !== this.graph.get("info")["title"]) {
        this.graph.setInfo("title", input);
      }
    },
    setDescription: function () {
      var input = this.$(".currentapp .info .setdescription").text();
      if (input !== this.graph.get("info")["description"]) {
        this.graph.setInfo("description", input);
      }
    },
    setUrl: function () {
      var input = this.$(".currentapp .info .seturl").text();
      input = this.encodeKey(input);
      if (input !== this.graph.get("info")["url"]) {
        this.graph.setInfo("url", input);
      }
    },
    updateCurrentInfo: function () {
      var graph = this.graph.toJSON();
      this.$(".currentapp")
        .html( this.currentTemplate(graph) );

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
            var tweet = " " + graph["info"]["title"] + " #meemoo " + graph["info"]["description"];
            // url is shortened to 20
            if (tweet.length >= 120) {
              tweet = tweet.substr(0,115) + "...";
            }
            tweet = gisturl + tweet;
            var twitterLink = $('<a title="post to twitter" target="_blank" class="share icon-twitter-bird"></a>')
              .attr("href", 'https://twitter.com/intent/tweet?text='+encodeURIComponent(tweet));

            this.$(".currentapp .permalink")
              .empty()
              .append(gistUrlSelect).append(" ")
              .append(gistLink)
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

      this.showPanel("library");

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
