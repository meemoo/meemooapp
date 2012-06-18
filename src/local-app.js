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
    localStorage: new Backbone.LocalStorage("LocalApps")
  });
    
});
