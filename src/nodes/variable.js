// extends src/node-box-native-view.js

$(function () {
  var template = '<div class="info" />';

  Iframework.NativeNodes['variable'] = Iframework.NodeBoxNativeView.extend({
    template: _.template(template),
    initializeCategory: function () {},
  });
});
