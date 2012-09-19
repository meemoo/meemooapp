// Module is used for Iframework.Library and has info about ins and outs
// Node is used by Graph, and has info about x, y, w, h

$(function(){

  var library = {
    image: [
      {"src":"meemoo:image/cam","info":{"title":"cam","author":"meemoo","description":"HTML5 webcam with getUserMedia."}},
      {"src":"meemoo:image/transform","info":{"title":"transform","author":"meemoo","description":"scale, translate, and/or rotate image (centered)"}},
      {"src":"meemoo:image/fit","info":{"title":"fit","author":"meemoo","description":"scale and crop an image to fit the given size. easy way to make thumbnails."}},
      {"src":"meemoo:image/rectangle","info":{"title":"rectangle","author":"meemoo","description":"draw a rectangle"}}
    ],
    effects: [
      {"src":"meemoo:image/grid","info":{"title":"grid","author":"forresto","description":"images stack up in a grid"}},
      {"src":"meemoo:image/monochrome","info":{"title":"monochrome","author":"ticky+flickr+forresto","description":"monochrome by atkinson, bayer, floydsteinberg, or no dither"}}
    ],
    util: [
      {"src":"meemoo:util/stats","info":{"title":"stats.js","author":"mr.doob","description":"fps stats graph"}},
      {"src":"meemoo:util/color-hsla","info":{"title":"color-hsla","author":"meemoo","description":"make hsla() css color (hue, saturation, lightness, alpha)"}},
      {"src":"meemoo:util/math","info":{"title":"math","author":"silentmatt","description":"math equation evaluator"}}
    ],
    file: [
      {"src":"meemoo:file/image","info":{"title":"image-in","author":"forresto","description":"Public image url to get the canvas pixel data."}},
      {"src":"meemoo:file/webm","info":{"title":"webm","author":"antimatter15","description":"(Chrome only) Canvas to WebM video encoder thanks to antimatter15/whammy."}}
    ],
    flow: [
      {"src":"meemoo:util/gate","info":{"title":"gate","author":"meemoo","description":"stop the data flow and let one through"}},
      {"src":"meemoo:time/throttle","info":{"title":"throttle","author":"meemoo","description":"too many fps? use throttle to limit data rate passing through flow."}}
    ],
    time: [
      {"src":"meemoo:time/tween","info":{"title":"tween","author":"sole","description":"Interpolate between two values."}},
      {"src":"meemoo:time/countdown","info":{"title":"countdown","author":"forresto","description":"Countdown to a bang."}}
    ],
    ui: [
      {"src":"meemoo:ui/button","info":{"title":"button","author":"meemoo","description":"a button sends a bang, and you can attach a keyboard key"}},
      {"src":"meemoo:ui/hslider","info":{"title":"hslider","author":"meemoo","description":"horizontal slider"}},
      {"src":"meemoo:ui/vslider","info":{"title":"vslider","author":"meemoo","description":"vertical slider"}},
      {"src":"meemoo:ui/xy","info":{"title":"xy pad","author":"meemoo","description":"sends coordinates as percentage"}}
    ],
    "iframe---fading": [
      {"src":"http://forresto.github.com/meemoo-canvas2gif/canvas2gif.html","info":{"title":"gif","author":"forresto","description":"canvas image data to animated gif"}},
      {"src":"http://forresto.github.com/meemoo-camcanvas/onionskin.html","info":{"title":"cam+onionskin","author":"taboca + forresto + ginger","description":"flash webcam image to canvas with onionskin of last frame"}},
      // {"src":"http://forresto.github.com/meemoo-camcanvas/webcam2canvas.html","info":{"title":"cam","author":"taboca + Forrest Oliphant","description":"flash webcam image to canvas"}},
      // {"src":"http://forresto.github.com/meemoo-image/transform.html","info":{"title":"transform","author":"forresto","description":"scale, translate, and/or rotate image (centered)"}},
      // {"src":"http://forresto.github.com/meemoo-image/combine.html","info":{"title":"combine","author":"forresto","description":"combine image layers"}},
      // {"src":"http://forresto.github.com/meemoo-image/crop.html","info":{"title":"crop","author":"meemoo","description":"crop image"}},
      {"src":"http://forresto.github.com/meemoo-blend/blend.html","info":{"title":"blend","author":"forresto","description":"blend imageData under and over with given mode"}},
      // {"src":"http://forresto.github.com/meemoo-image/mask.html","info":{"title":"alpha mask","author":"forresto","description":"use a grayscale image as the alpha for another image"}},
      // {"src":"http://forresto.github.com/meemoo-image/threshold.html","info":{"title":"threshold","author":"forresto","description":"image to monochrome via luminosity threshold"}},
      // {"src":"http://forresto.github.com/meemoo-image/alpha.html","info":{"title":"alpha","author":"forresto","description":"use a greyscale image as the alpha for a color image"}},
      {"src":"http://forresto.github.com/meemoo-image/aviary.html","info":{"title":"aviary","author":"aviary","description":"aviary.com image editor with enhance, brightness, contrast, crop, paint, stickers, text..."}},
      {"src":"http://forresto.github.com/meemoo-paint/paint.html","info":{"title":"paint","author":"forresto","description":"canvas pixel paint"}},
      {"src":"http://automata.github.com/meemoo-harmony/","info":{"title":"harmony","author":"ze frank + mr.doob + automata","description":"sketchy procedural drawing tool"}},
      {"src":"http://forresto.github.com/meemoo-image/text.html","info":{"title":"text","author":"forresto","description":"text to image"}},
      // {"src":"http://forresto.github.com/meemoo-image/rectangle.html","info":{"title":"rectangle","author":"forresto","description":"draw a rectangle"}},
      // {"src":"http://forresto.github.com/meemoo-image/circle.html","info":{"title":"circle","author":"forresto","description":"draw a circle or an arc"}},
      {"src":"http://forresto.github.com/meemoo-modules/processing.html","info":{"title":"processing.js","description":"processing code loader"}},
      {"src":"http://forresto.github.com/meemoo-modules/canvasarray.html","info":{"title":"canvas array","author":"forresto","description":"hold a stack of canvases for reuse, click sends it, arrows navigate to prev/next"}},
      // {"src":"http://forresto.github.com/meemoo-image/spritesheet.html","info":{"title":"spritesheet","author":"forresto","description":"makes a single-image filmstrip sprite sheet"}},
      // {"src":"http://forresto.github.com/meemoo-image/spritesplit.html","info":{"title":"spritesplit","author":"forresto","description":"separates images from filmstrip sprite sheet"}}
      // {"src":"http://forresto.github.com/meemoo-math/math.html","info":{"title":"math","author":"silentmatt + forresto","description":"math equation evaluator"}},
      // {"src":"http://forresto.github.com/meemoo-modules/color-hsla.html","info":{"title":"color-hsla","author":"forresto","description":"make hsla() css color (hue, saturation, lightness, alpha)"}},
      // {"src":"http://forresto.github.com/meemoo-modules/color-rgba.html","info":{"title":"color-rgba","author":"forresto","description":"make rgba() css color (red, green, blue, alpha)"}},
      {"src":"http://forresto.github.com/meemoo-modules/string-join.html","info":{"title":"string-join","author":"forresto","description":"join text strings into one string"}},
      {"src":"http://forresto.github.com/meemoo-modules/log.html","info":{"title":"log","author":"meemoo","description":"log all messages"}},
      // {"src":"http://meemoo-image-in.phpfogapp.com/image-in.html","info":{"title":"image-in","author":"forresto","description":"Public image url to get the canvas pixel data."}},
      {"src":"http://forresto.github.com/meemoo-modules/file-reader-image.html","info":{"title":"image file","author":"forresto","description":"Select or drag local images to get the canvas pixel data. Requires a browser with the FileReader API, like Firefox or Chrome."}},
      {"src":"http://forresto.github.com/meemoo-modules/imgur.html","info":{"title":"imgur","author":"forresto","description":"image data url to Imgur image sharing service"}},
      // {"src":"http://forresto.github.com/meemoo-modules/img2canvas.html","info":{"title":"img2canvas","author":"forresto","description":"image data url to canvas image data"}},
      {"src":"http://forresto.github.com/meemoo-modules/canvas2img.html","info":{"title":"canvas2img","author":"forresto","description":"canvas image data to image data url"}},
      {"src":"http://forresto.github.com/meemoo-modules/delay.html","info":{"title":"delay","author":"forresto","description":"hold a stack of stack of data until buffer is full"}},
      // {"src":"http://forresto.github.com/meemoo-modules/timer.html","info":{"title":"timer","author":"forresto","description":"countdown to bang"}},
      {"src":"http://forresto.github.com/meemoo-modules/clock.html","info":{"title":"clock","author":"forresto","description":"time: hours minutes seconds with percentages"}},
      {"src":"http://forresto.github.com/meemoo-modules/metronome.html","info":{"title":"metronome","author":"forresto","description":"meemoo.js module for rhythm in bpm or ms"}},
      {"src":"http://forresto.github.com/meemoo-modules/taptempo.html","info":{"title":"taptempo","author":"forresto","description":"tap out your rhythm, averages last 4 taps"}},
      {"src":"http://forresto.github.com/meemoo-modules/audioarray.html","info":{"title":"audioarray","author":"forresto","description":"hold and address a stack of audio objects"}},
      {"src":"http://forresto.github.com/meemoo-modules/speech2text.html","info":{"title":"speech2text","author":"forresto","description":"speech to text with x-webkit-speech"}},
      {"src":"http://forresto.github.com/meemoo-speak.js/text2speech.html","info":{"title":"text2speech","author":"forresto","description":"text to speech with speak.js"}}
    ]
  };
  
  Iframework.loadLibrary(library);

});
