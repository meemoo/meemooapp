$(function(){

  var template = '<div class="info" />';

  Iframework.NodeBoxNativeView = Backbone.View.extend({
    tagName: "div",
    className: "nativenode",
    template: _.template(template),
    initialize: function () {
      this.render();
      return this;
    },
    render: function () {
      this.$el.html(this.template(this.model));
      return this;
    }

  });

});
