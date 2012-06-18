$(function(){
  
  // Router
  var IframeworkRouter = Backbone.Router.extend({
    routes: {
      "example/:url": "loadExample", // #/example/url
      "unsaved":      "default",
      "local/:url":   "loadLocal",
      "gist/https://gist.github.com/:id": "loadGistUgly", 
      "gist/:id":     "loadGist", 
      "*path":        "default"
    },
    loadExample: function(url) {
      Iframework.loadExample(url);
    },
    loadGistUgly: function (id) {
      this.navigate("gist/"+id, {replace: true});
      this.loadGist(id);
    },
    loadLocal: function(id) {
      Iframework.loadLocal(id);
    },
    loadGist: function(id) {
      Iframework.loadFromGistId(id);
    },
    "default": function() {
      // Done in Iframework.loadExampleApps()
    }
  });
  Iframework.router = new IframeworkRouter();
  Backbone.history.start();
    
});