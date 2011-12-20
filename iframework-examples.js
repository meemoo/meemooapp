$(document).ready(function(){
  
  var exampleGraphs = [
  // {
  //   "info": {
  //     "title": "contextfree to gif",
  //     "author": "forresto",
  //     "description": "contextfree to animated gif",
  //     "url": "contextfree"
  //   },
  //   "nodes": [
  //     {
  //       "src": "/modules/contextfree.html",
  //       "x": 128,
  //       "y": 45,
  //       "w": 343,
  //       "h": 524,
  //       "id": 1
  //     },
  //     {
  //       "src": "http://forresto.github.com/meemoo-canvas2gif/canvas2gif.html",
  //       "x": 622,
  //       "y": 43,
  //       "w": 357,
  //       "h": 285,
  //       "id": 3,
  //       "state": {
  //         "delay": 200,
  //         "quality": 75
  //       }
  //     },
  //     {
  //       "src": "http://forresto.github.com/meemoo-modules/imgur.html",
  //       "x": 625,
  //       "y": 398,
  //       "w": 357,
  //       "h": 297,
  //       "id": 5,
  //       "state": {
  //         "title": "meemoo/cam2gif image share",
  //         "caption": "This image was created with a Meemoo composition. http://meemoo.org/iframework/#/example/cam2gif"
  //       }
  //     }
  //   ],
  //   "edges": []
  // },
  {
    "info": {
      "title": "cam to gif",
      "author": "forresto",
      "description": "webcam to animated gif",
      "url": "cam2gif"
    },
    "nodes": [
      {
        "src": "http://forresto.github.com/meemoo-camcanvas/onionskin.html",
        "x": 128,
        "y": 45,
        "w": 343,
        "h": 280,
        "id": 1,
        "state": {
          "quality": 75,
          "width": 320,
          "height": 240
        }
      },
      {
        "src": "http://forresto.github.com/meemoo-canvas2gif/canvas2gif.html",
        "x": 622,
        "y": 43,
        "w": 357,
        "h": 285,
        "id": 3,
        "state": {
          "delay": 200,
          "quality": 75
        }
      },
      {
        "src": "http://forresto.github.com/meemoo-modules/imgur.html",
        "x": 625,
        "y": 398,
        "w": 357,
        "h": 297,
        "id": 5,
        "state": {
          "title": "meemoo/cam2gif image share",
          "caption": "This image was created with a Meemoo composition. http://meemoo.org/iframework/#/example/cam2gif"
        }
      }
    ],
    "edges": [
      {
        "source": [
          1,
          "image"
        ],
        "target": [
          3,
          "image"
        ],
        "color": "#DF151A"
      },
      {
        "source": [
          3,
          "gif"
        ],
        "target": [
          5,
          "dataurl"
        ],
        "color": "#F4F328"
      }
    ]
  },
  {
    "info": {
      "title": "cam to glitch",
      "author": "forresto",
      "description": "webcam to jpg to glitch",
      "url": "cam"
    },
    "nodes": [
      {
        "src": "http://forresto.github.com/meemoo-modules/metronome.html",
        "x": 139,
        "y": 45,
        "w": 200,
        "h": 100,
        "id": 1,
        "state": {
          "bpm": 150
        }
      },
      {
        "src": "http://forresto.github.com/meemoo-camcanvas/webcam2jpg.html",
        "x": 581,
        "y": 49,
        "w": 339,
        "h": 283,
        "id": 2,
        "state": {
          "quality": 50,
          "width": 320,
          "height": 240
        }
      },
      {
        "src": "http://forresto.github.com/meemoo-jpgglitch/index.html",
        "x": 138,
        "y": 220,
        "w": 339,
        "h": 262,
        "id": 4
      },
      {
        "src": "http://forresto.github.com/meemoo-modules/img2canvas.html",
        "x": 282,
        "y": 559,
        "w": 116,
        "h": 98,
        "id": 5
      },
      {
        "src": "http://forresto.github.com/meemoo-modules/reflow.html",
        "x": 646,
        "y": 398,
        "w": 256,
        "h": 297,
        "id": 3
      }
    ],
    "edges": [
      {
        "source": [
          1,
          "beat"
        ],
        "target": [
          2,
          "capture"
        ],
        "color": "#DF151A"
      },
      {
        "source": [
          2,
          "jpg"
        ],
        "target": [
          4,
          "jpg"
        ],
        "color": "#FD8603"
      },
      {
        "source": [
          5,
          "image"
        ],
        "target": [
          3,
          "image"
        ],
        "color": "#F4F328"
      },
      {
        "source": [
          4,
          "jpg"
        ],
        "target": [
          5,
          "dataurl"
        ],
        "color": "#00DA3C"
      }
    ]
  },
  {
    info: {
      title: "processing dot js",
      author: "forresto",
      description: "processing to reflow",
      url: "processing"
    },
    nodes: [
      {
        id: 1,
        src: "http://forresto.github.com/meemoo-modules/metronome.html", 
        "x":130,"y":47,"w":230,"h":110, 
        state: { bpm: 140, start: true }
      },
      {
        id: 3,
        src: "http://forresto.github.com/meemoo-modules/processing.html", 
        "x":148,"y":246,"w":308,"h":348,
        state: { 
          processingcode: "void setup() { size(300, 300); colorMode(HSB, 360, 100, 300); noStroke(); background(0); } \n void mousePressed () { fill(random(360), 180, 300); triangle(random(width), random(height), 100, 100, 200, 200);}" 
        }
      },
      {
        id: 4,
        src: "http://forresto.github.com/meemoo-modules/reflow.html", 
        "x":630,"y":88,"w":449,"h":199
      },
      {
        id: 5,
        src: "http://forresto.github.com/meemoo-modules/reflow.html", 
        "x":686,"y":384,"w":440,"h":204
      }
    ],
    edges: [
      { source: [1, "beat"],  target: [3, "pressed"] },
      { source: [3, "image"], target: [4, "image"] }
    ]
  },
  {
    "info": {
      "title": "doodle flipbook",
      "author": "forresto",
      "description": "processing doodle to image stack to animated gif",
      "url": "flipbook"
    },
    "nodes": [
      {
        "src": "http://forresto.github.com/meemoo-modules/processing.html",
        "x": 156,
        "y": 63,
        "w": 308,
        "h": 348,
        "id": 1,
        "state": {
          "processingcode": "void setup() { size(300, 300); background(0); stroke(255); } Integer lastX, lastY; void draw() { if(mousePressed) { if (lastX==null) {lastX = mouseX; lastY = mouseY;} line(mouseX, mouseY, lastX, lastY); lastX = mouseX; lastY = mouseY;} else {lastX = null; lastY = null;}}"
        }
      },
      {
        "src": "http://forresto.github.com/meemoo-modules/canvasstack.html",
        "x": 655,
        "y": 53,
        "w": 308,
        "h": 420,
        "id": 3
      },
      {
        "src": "http://forresto.github.com/meemoo-canvas2gif/canvas2gif.html",
        "x": 154,
        "y": 473,
        "w": 354,
        "h": 341,
        "id": 2,
        "state": {
          "delay": 200,
          "quality": 75
        }
      }
    ],
    "edges": [
      {
        "source": [
          1,
          "image"
        ],
        "target": [
          3,
          "image"
        ],
        "color": "#00CBE7"
      },
      {
        "source": [
          3,
          "image"
        ],
        "target": [
          2,
          "image"
        ],
        "color": "#00DA3C"
      }
    ]
  },
  {
    "info": {
      "title": "cam doodle",
      "author": "forresto",
      "description": "webcam to processing doodle to animated gif",
      "url": "camdoodle"
    },
    "nodes": [
      {
        "src": "http://forresto.github.com/meemoo-camcanvas/webcam2canvas.html",
        "x": 127,
        "y": 45,
        "w": 342,
        "h": 283,
        "id": 4,
        "state": {
          "quality": 75,
          "width": 320,
          "height": 240
        }
      },
      {
        "src": "http://forresto.github.com/meemoo-modules/processing.html",
        "x": 625,
        "y": 44,
        "w": 353,
        "h": 284,
        "id": 1,
        "state": {
          "processingcode": "void setup() { size(320, 240); background(0); stroke(255); } Integer lastX, lastY; void draw() { if(mousePressed) { if (lastX==null) {lastX = mouseX; lastY = mouseY;} line(mouseX, mouseY, lastX, lastY); lastX = mouseX; lastY = mouseY;} else {lastX = null; lastY = null;}}"
        }
      },
      {
        "src": "http://forresto.github.com/meemoo-modules/canvasstack.html",
        "x": 126,
        "y": 423,
        "w": 347,
        "h": 315,
        "id": 3
      },
      {
        "src": "http://forresto.github.com/meemoo-canvas2gif/canvas2gif.html",
        "x": 621,
        "y": 450,
        "w": 354,
        "h": 341,
        "id": 2,
        "state": {
          "delay": 200,
          "quality": 75
        }
      },
      {
        "src": "http://forresto.github.com/meemoo-modules/imgur.html",
        "x": 677,
        "y": 876,
        "w": 357,
        "h": 297,
        "id": 6,
        "state": {
          "title": "meemoo/camdoodle image share",
          "caption": "This image was created with a Meemoo composition. http://meemoo.org/iframework/#/example/camdoodle"
        }
      }
    ],
    "edges": [
      {
        "source": [
          1,
          "image"
        ],
        "target": [
          3,
          "image"
        ],
        "color": "#00CBE7"
      },
      {
        "source": [
          3,
          "image"
        ],
        "target": [
          2,
          "image"
        ],
        "color": "#00DA3C"
      },
      {
        "source": [
          4,
          "image"
        ],
        "target": [
          1,
          "image"
        ],
        "color": "#DF151A"
      },
      {
        "source": [
          2,
          "gif"
        ],
        "target": [
          6,
          "dataurl"
        ],
        "color": "#FD8603"
      }
    ]
  }
  
  ];
  
  // Default example
  window.Iframework.showGraph(exampleGraphs[0]);
  
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