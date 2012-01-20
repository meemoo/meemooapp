$(document).ready(function(){
  
  var exampleGraphs = [
    {"info":{"title":"cam to gif","author":"forresto","description":"webcam to animated gif","url":"cam2gif"},"nodes":[{"src":"http://forresto.github.com/meemoo-camcanvas/onionskin.html","x":128,"y":45,"w":343,"h":280,"state":{"quality":75,"width":320,"height":240},"id":1},{"src":"http://forresto.github.com/meemoo-canvas2gif/canvas2gif.html","x":622,"y":43,"w":357,"h":285,"state":{"delay":200,"quality":75},"id":3},{"src":"http://forresto.github.com/meemoo-modules/imgur.html","x":625,"y":398,"w":357,"h":297,"state":{"title":"meemoo/cam2gif image share","caption":"This image was created with a Meemoo composition. http://meemoo.org/iframework/#/example/cam2gif"},"id":5}],"edges":[{"source":[1,"image"],"target":[3,"image"]},{"source":[3,"gif"],"target":[5,"dataurl"]}]},
    {"info":{"title":"cam to canvas","author":"forresto","description":"webcam to canvas","url":"cam"},"nodes":[{"src":"http://forresto.github.com/meemoo-modules/metronome.html","x":205,"y":43,"w":200,"h":100,"state":{"bpm":60},"id":1},{"src":"http://forresto.github.com/meemoo-camcanvas/webcam2canvas.html","x":608,"y":43,"w":339,"h":516,"state":{"quality":75,"width":320,"height":240},"id":2},{"src":"http://forresto.github.com/meemoo-modules/reflow.html","x":199,"y":245,"w":256,"h":297,"state":{},"id":3}],"edges":[{"source":[1,"beat"],"target":[2,"capture"]},{"source":[2,"image"],"target":[3,"image"]}]},
    {"info":{"title":"cam to glitch","author":"forresto","description":"webcam to jpg to glitch","url":"glitch"},"nodes":[{"src":"http://forresto.github.com/meemoo-modules/metronome.html","x":139,"y":45,"w":200,"h":100,"state":{"bpm":150},"id":1},{"src":"http://forresto.github.com/meemoo-camcanvas/webcam2jpg.html","x":581,"y":49,"w":339,"h":283,"state":{"quality":20,"width":320,"height":240},"id":2},{"src":"http://forresto.github.com/meemoo-jpgglitch/jpgglitch.html","x":138,"y":220,"w":339,"h":262,"state":{},"id":4},{"src":"http://forresto.github.com/meemoo-modules/img2canvas.html","x":282,"y":559,"w":116,"h":98,"state":{},"id":5},{"src":"http://forresto.github.com/meemoo-modules/reflow.html","x":646,"y":398,"w":256,"h":297,"state":{},"id":3}],"edges":[{"source":[1,"beat"],"target":[2,"capture"]},{"source":[2,"jpg"],"target":[4,"jpg"]},{"source":[5,"image"],"target":[3,"image"]},{"source":[4,"jpg"],"target":[5,"dataurl"]}]},
    {"info":{"title":"processing dot js","author":"forresto","description":"processing to reflow","url":"processing"},"nodes":[{"src":"http://forresto.github.com/meemoo-modules/metronome.html","x":147,"y":44,"w":230,"h":110,"state":{"bpm":140,"start":true},"id":1},{"src":"http://forresto.github.com/meemoo-modules/processing.html","x":148,"y":246,"w":308,"h":348,"state":{"code":"void setup() { size(300, 300); colorMode(HSB, 360, 100, 300); noStroke(); background(0); } \n void mousePressed () { fill(random(360), 180, 300); triangle(random(width), random(height), 100, 100, 200, 200);}"},"id":3},{"src":"http://forresto.github.com/meemoo-modules/reflow.html","x":630,"y":88,"w":449,"h":199,"state":{},"id":4},{"src":"http://forresto.github.com/meemoo-modules/reflow.html","x":686,"y":384,"w":440,"h":204,"state":{},"id":5}],"edges":[{"source":[1,"beat"],"target":[3,"pressed"]},{"source":[3,"image"],"target":[4,"image"]},{"source":[1,"beat"],"target":[3,"send"]}]},
    {"info":{"title":"doodle flipbook","author":"forresto","description":"paint doodle to image array to animated gif","url":"flipbook"},"nodes":[{"src":"http://forresto.github.com/meemoo-paint/paint.html","x":132,"y":45,"w":377,"h":342,"state":{},"id":1},{"src":"http://forresto.github.com/meemoo-modules/canvasarray.html","x":760,"y":401,"w":348,"h":290,"state":{},"id":3},{"src":"http://forresto.github.com/meemoo-canvas2gif/canvas2gif.html","x":702,"y":43,"w":354,"h":291,"state":{"delay":200,"quality":75,"matte":"#FFFFFF"},"id":2},{"src":"http://forresto.github.com/meemoo-modules/imgur.html","x":1275,"y":81,"w":357,"h":297,"state":{"title":"meemoo/flipbook image share","caption":"This image was created with a Meemoo composition. http://meemoo.org/iframework/#/example/flipbook"},"id":6}],"edges":[{"source":[1,"image"],"target":[1,"tracing"]},{"source":[1,"image"],"target":[2,"image"]},{"source":[1,"image"],"target":[3,"image"]},{"source":[3,"image"],"target":[2,"image"]},{"source":[2,"gif"],"target":[6,"dataurl"]}]},
    {"info":{"title":"cam doodle","author":"forresto","description":"webcam to processing doodle to animated gif","url":"camdoodle"},"nodes":[{"src":"http://forresto.github.com/meemoo-camcanvas/onionskin.html","x":126,"y":43,"w":342,"h":283,"state":{"quality":75,"width":320,"height":240},"id":4},{"src":"http://forresto.github.com/meemoo-paint/paint.html","x":634,"y":53,"w":377,"h":342,"state":{},"id":1},{"src":"http://forresto.github.com/meemoo-canvas2gif/canvas2gif.html","x":125,"y":386,"w":354,"h":341,"state":{"delay":200,"quality":75,"matte":"#FFFFFF"},"id":2},{"src":"http://forresto.github.com/meemoo-modules/imgur.html","x":652,"y":456,"w":357,"h":297,"state":{"title":"meemoo/camdoodle image share","caption":"This image was created with a Meemoo composition. http://meemoo.org/iframework/#/example/camdoodle"},"id":6}],"edges":[{"source":[4,"image"],"target":[1,"image"]},{"source":[1,"image"],"target":[1,"tracing"]},{"source":[1,"image"],"target":[2,"image"]},{"source":[2,"gif"],"target":[6,"dataurl"]}]},
    {"info":{"title":"(speech to) text to speech","author":"forresto","description":"(in chrome, speech to) text to speech","url":"text2speech"},"nodes":[{"src":"http://forresto.github.com/meemoo-modules/speech2text.html","x":162,"y":61,"w":346,"h":98,"state":{},"id":1},{"src":"http://forresto.github.com/meemoo-speak.js/text2speech.html","x":234,"y":221,"w":167,"h":117,"state":{"amplitude":100,"pitch":50,"speed":175,"wordgap":0},"id":2},{"src":"http://forresto.github.com/meemoo-modules/audioarray.html","x":657,"y":227,"w":330,"h":280,"state":{},"id":3}],"edges":[{"source":[2,"info"],"target":[3,"title"]},{"source":[2,"audio"],"target":[3,"audio"]},{"source":[1,"text"],"target":[2,"text"]}]}
  ];
  
  // Default example
  Iframework.showGraph(exampleGraphs[0]);
  
  // Router
  var IframeworkRouter = Backbone.Router.extend({

    routes: {
      "/example/:url": "loadExample" // #/example/url
    },

    loadExample: function(url) {
      for (var i=0; i<exampleGraphs.length; i++) {
        if (exampleGraphs[i]["info"]["url"] === url) {
          Iframework.showGraph(exampleGraphs[i]);
          document.title = "meemoo/"+url;
          return;
        }
      }
    }

  });
  Iframework.router = new IframeworkRouter();
  Backbone.history.start();
  
  // Make example links:
  var exampleLinks = "examples: "
  for (var i=0; i<exampleGraphs.length; i++) {
    var url = exampleGraphs[i]["info"]["url"];
    if (url) {
      exampleLinks += '<a href="#/example/'+url+'" title="'+exampleGraphs[i]["info"]["title"]+": "+exampleGraphs[i]["info"]["description"]+'">'+url+'</a> ';
    }
  }
  $("footer").append(exampleLinks);
  
});