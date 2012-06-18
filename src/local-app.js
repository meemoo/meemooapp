$(function(){

  Iframework.LocalApp = Backbone.Model.extend({
    initializeView: function () {
      if (!this.view) {
        this.view = new Iframework.LocalAppView({model:this});
      }
      return this.view;
    }
  });

  Iframework.LocalApps = Backbone.Collection.extend({
    model: Iframework.LocalApp,
    localStorage: new Backbone.LocalStorage("LocalApps"),
    updateOrCreate: function (graph) {
      var app;
      app = this.find(function(app){
        return app.get("graph")["info"]["url"] === graph["info"]["url"];
      });
      if (!app) {
        app = this.create({graph:graph});
      } else {
        app.save({graph:graph});
      }
      return app;
    }

  });
    
});
