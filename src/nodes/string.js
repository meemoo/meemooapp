// extends src/node-box-native-view.js

$(function () {
  var template = '<div class="info" />';

  Iframework.NativeNodes['string'] = Iframework.NodeBoxNativeView.extend({
    template: _.template(template),
    info: {
      title: 'string',
      description: 'extend me',
    },
    initializeCategory: function () {},
  });
});
