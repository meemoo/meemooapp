/*global filepicker:true, atob:true*/

( function(Iframework) {

  var FILEPICKER_API_KEY = "AaqPpE9LORQel03S9cCl7z";
  var IMAGE_SERVER = "http://meemoo-images.s3.amazonaws.com/";

  // Shim
  if ( !window.URL ) {
    window.URL = window.webkitURL || window.msURL || window.oURL || false;
  }

  var template = $(
    '<div class="meemoo-plugin-images">'+
      '<h2>Local images (not public)</h2>'+
      '<span style="position:absolute;width:0px;overflow:hidden;"><input type="file" class="fileinput" accept="image/*" multiple /></span>'+
      '<button class="localfile icon-camera" title="Not public. From computer (or mobile camera).">Choose local image</button> from computer or mobile camera'+
      '<div class="image-drop local-drop"><div class="drop-indicator"><p>drag image here to hold it</p></div></div>'+
      '<div class="local-listing"></div>'+
      '<h2>Public images</h2>'+
      '<button class="publicfile icon-globe-1" title="Public image from computer, URL, Flickr, Dropbox, Google...">Upload image</button> from computer, Flickr, G, Db, etc.'+
      '<div class="info"></div>'+
      '<div class="image-drop public-drop"><div class="drop-indicator"><p>drag image here to save to web</p></div></div>'+
      '<div class="public-listing"></div>'+
    '</div>'
  );

  // Add menu
  Iframework.addMenu("images", template, "icon-picture");

  // Set info
  var info = template.find(".info");
  var setInfo = function (string) {
    info.text(string);
  };

  // Load Filepicker
  yepnope({
    load: "http://api.filepicker.io/v1/filepicker.js",
    complete: function () {
      if (window.filepicker){
        filepicker.setKey(FILEPICKER_API_KEY);
      } else {
        setInfo("Offline or image service not available.");
      }
    }
  });

  // Open image panel by dragging over show button
  Iframework.$(".showpanel .show-images").droppable({
    accept: ".canvas",
    tolerance: "pointer",
    activeClass: "drop-indicator",
    over: function (event, ui) {
      $(this).trigger("click");
    }
  });

  // Drop panels
  template.find(".image-drop").droppable({
    accept: ".canvas",
    hoverClass: "drop-hover",
    activeClass: "drop-active",
    // Don't also drop on graph
    greedy: true
  });
  template.find(".local-drop").on("drop", function(event, ui) {
    var image = ui.helper.data("meemoo-drag-canvas");
    if (!image) { return false; }
    var thumbnail = makeThumbnail(image);
    localListing.append( thumbnail );
  });

  // Make thumbnail element
  var makeThumbnail = function(image){
    // image can be Image or Canvas
    var el = $('<div class="meemoo-plugin-images-thumbnail canvas">')
      .append(image)
      .draggable({
        cursor: "pointer",
        cursorAt: { top: -10, left: -10 },
        helper: function( event ) {
          var helper = $( '<div class="drag-image"><h2>Copy this</h2></div>' )
            .data({
              "meemoo-drag-type": "canvas",
              "meemoo-source-image": image
            });
          $(document.body).append(helper);
          _.delay(function(){
            dragCopyCanvas(helper);
          }, 100);
          return helper;
        }
      });
    return el;
  };

  var dragCopyCanvas = function (helper) {
    if (!helper) { return; }
    var image = helper.data("meemoo-source-image");
    var canvasCopy = document.createElement("canvas");
    canvasCopy.width = image.naturalWidth ? image.naturalWidth : image.width;
    canvasCopy.height = image.naturalHeight ? image.naturalHeight : image.height;
    canvasCopy.getContext("2d").drawImage(image, 0, 0);
    helper.data("meemoo-drag-canvas", canvasCopy);
    helper.append(canvasCopy);
  };


  // Local files
  var fileInput = template.find(".fileinput");
  var localListing = template.find(".local-listing");
  fileInput.change( function (event) {
    // Load local image
    var files = event.target.files;
    for (var i=0; i<files.length; i++) {
      var img = new Image();
      img.src = window.URL.createObjectURL( files[i] );
      var thumbnail = makeThumbnail(img);
      localListing.append( thumbnail );
    }
  });
  template.find(".localfile").click(function(){
    // Trigger 
    fileInput.trigger("click");
  });


  // Filepicker select
  var publicListing = template.find(".public-listing");
  template.find(".publicfile").click(function(){
    if ( !window.filepicker ) { 
      setInfo("Image service not yet available.");
      return false; 
    }
    // Open chooser
    filepicker.pickAndStore(
      {
        mimetype: 'image/*',
        multiple: true,
        maxSize: 5*1024*1024
      },
      {
        location: 'S3',
        path: 'v1/in/',
        access: 'public'
      },
      function(files){
        for (var i=0; i<files.length; i++) {
          var img = new Image();
          img.src = files[i].url;
          var thumbnail = makeThumbnail(img);
          publicListing.append( thumbnail );
        }
      }
    );
  });

  // Filepicker drop
  template.find(".public-drop").on("drop", function(event, ui) {
    if ( !window.filepicker ) { 
      setInfo("Image service not yet available.");
      return false; 
    }

    var image = ui.helper.data("meemoo-drag-canvas");
    if (!image) { return false; }

    var b64;
    try{
      b64 = image.toDataURL().split(',')[1];
    } catch (error) {
      setInfo('Not able to get image data. Right-click "Save as..." or take a screenshot.');
      return false;
    }

    filepicker.store(
      b64, 
      {
        mimetype: 'image/png',
        location: 'S3',
        path: 'v1/out/',
        filename: 'meemoo.png',
        access: 'public',
        base64decode: true
      }, 
      function (file) {
        var img = new Image();
        img.src = file.url;
        var thumbnail = makeThumbnail(img);
        publicListing.append( thumbnail );
        // Info
        setInfo('Upload done :-)');
        _.delay(function(){
          setInfo('');
        }, 2000);
      }, 
      function (error) {
        setInfo('Upload error :-(');
      }, 
      function (percent) {
        setInfo(percent + "% uploaded.");
      }
    );

  });


  // Globally-accessible functions
  Iframework.plugins.images = {};

  Iframework.plugins.images.GalleryImage = Backbone.Model.extend({
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

  var imageTemplate = 
    '<a class="url" href="#local/<%= graph.info.url %>"></a>'+
    '<div class="info">'+
      '<h2 class="title"><%= graph.info.title %></h2>' +
      '<p class="description"><%= graph.info.description %></p>' +
    '</div>';

  Iframework.plugins.images.GalleryImageView = Backbone.View.extend({
    tagName: "div",
    className: "plugin-images-image",
    template: _.template(imageTemplate),
    events: {
    },
    initialize: function () {
      this.render();
      Iframework.$(".localapps").append( this.el );

      this.model.on('change', this.update, this);
      this.model.on('destroy', this.remove, this);

      return this;
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      this.$(".url").text(decodeURIComponent(this.model.get("graph")["info"]["url"]));
      this.$(".info").hide();
    },
    update: function () {
      this.render();
      Iframework.updateCurrentInfo();
    },
    remove: function () {
      this.$el.remove();
    }

  });

  Iframework.plugins.images.GalleryImages = Backbone.Collection.extend({
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

}(Iframework) );