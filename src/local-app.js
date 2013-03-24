$(function(){

  Iframework.LocalApp = Backbone.Model.extend({
    initializeView: function () {
      if (!this.view) {
        this.view = new Iframework.LocalAppView({model:this});
      }
      return this.view;
    },
    load: function(){
      
      Iframework._loadedLocalApp = this;
      // Clone graph
      var graph = JSON.parse(JSON.stringify(this.get("graph")));
      Iframework.loadGraph(graph);

      //DEBUG
      // Iframework.showLoad();
    },
    toJSON: function () {
      return {
        id: this.id,
        graph: this.get("graph")
      };
    }
  });

  Iframework.LocalApps = Backbone.Collection.extend({
    model: Iframework.LocalApp,
    localStorage: new Backbone.LocalStorage("LocalApps"),
    getByUrl: function (url) {
      var app = this.find(function(app){
        return app.get("graph")["info"]["url"] === url;
      });
      return app;
    },
    updateOrCreate: function (graph) {
      var app;
      app = this.find(function(app){
        return app.get("graph")["info"]["url"] === graph["info"]["url"];
      });
      if (app) {
        app.save({graph:graph});
        app.trigger("change");
      } else {
        app = this.create({graph:graph});
        app.initializeView();
      }
      return app;
    }

  });
    
});
