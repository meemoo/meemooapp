$(function(){

  Iframework.util = {
    // From YUI3 via http://stackoverflow.com/a/7390555/592125
    types: {
      'undefined'        : 'undefined',
      'number'           : 'number',
      'boolean'          : 'boolean',
      'string'           : 'string',
      '[object Function]': 'function',
      '[object RegExp]'  : 'regexp',
      '[object Array]'   : 'array',
      '[object Date]'    : 'date',
      '[object Error]'   : 'error',
      '[object HTMLCanvasElement]': 'HTMLCanvasElement',
      '[object ImageData]': 'ImageData'
    },
    type: function(o) {
      return this.types[typeof o] || this.types[Object.prototype.toString.call(o)] || (o ? 'object' : 'null');
    },
    imageTypes: ["png", "gif", "jpg", "jpeg", "webp"],
    isImageURL: function(url) {
      var fileTypeSplit = url.split(".");
      if (fileTypeSplit.length > 1) {
        var fileType = fileTypeSplit[fileTypeSplit.length-1];
        return (this.imageTypes.indexOf(fileType) > -1);
      }
      return false;
    }    
  };

  // requestAnimationFrame shim from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  }());

});
