$(function(){
  
  // Router
  var IframeworkRouter = Backbone.Router.extend({
    routes: {
      "example/:url": "loadExample", // #example/url
      "new":          "newBlank",
      "local/:url":   "loadLocal",
      "gist/https://gist.github.com/:user/:id": "loadGistUgly", // Redirects
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
    loadLocal: function(url) {
      Iframework.loadLocal(url);
    },
    loadGist: function(id) {
      Iframework.loadFromGistId(id);
    },
    newBlank: function() {
      Iframework.newBlank();
    },
    'default': function() {

    }
  });
  Iframework.router = new IframeworkRouter();
  Backbone.history.start();
    
});