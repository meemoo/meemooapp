/*global filepicker:true, atob:true*/

( function(Iframework) {

  var FILEPICKER_API_KEY = "AaqPpE9LORQel03S9cCl7z";
  var IMAGE_SERVER = "http://i.meemoo.me/";

  // Shim
  if ( !window.URL ) {
    window.URL = window.webkitURL || window.msURL || window.oURL || false;
  }

  var template = $(
    '<div class="meemoo-plugin-images">'+
      '<h2>Local images (not saved)</h2>'+
      '<span style="position:absolute;width:0px;overflow:hidden;"><input type="file" class="fileinput" accept="image/*" multiple /></span>'+
      '<button class="localfile icon-camera" title="Not public. From computer (or mobile camera).">Choose local image</button> from computer or mobile camera'+
      '<div class="image-drop local-drop"><div class="drop-indicator"><p>drag image here to hold it</p></div></div>'+
      '<div class="local-listing"></div>'+
      '<h2>Public images</h2>'+
      '<button class="publicfile icon-globe-1" title="Upload image to Meemoo from computer, URL, Flickr, Google, Dropbox...">Upload image</button> from computer, Flickr, G, Db, etc.'+
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
          // Add to local storage and make thumbnail
          var o = {main:files[i]};
          var img = new Iframework.plugins.images.GalleryImage({files:o});
          publicImages.add(img);
          img.save();
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
      b64 = image.toDataURL().split(',', 2)[1];
      // b64 = window.atob(b64);
    } catch (error) {
      setInfo('Not able to get image data. Right-click "Save as..." or take a screenshot.');
      return false;
    }

    setInfo('Uploading...');

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
        // Add to local storage and make thumbnail
        var files = {main:file};
        var img = new Iframework.plugins.images.GalleryImage({files:files});
        publicImages.add(img);
        img.save();

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
    initialize: function () {
      this.mainsrc = IMAGE_SERVER + this.get("files")["main"]["key"];
      this.initializeView();
    },
    initializeView: function () {
      if (!this.view) {
        this.view = new Iframework.plugins.images.GalleryImageView({model:this});
      }
      return this.view;
    },
    toJSON: function () {
      return {
        id: this.id,
        files: this.get("files")
      };
    }
  });

  Iframework.plugins.images.GalleryImages = Backbone.Collection.extend({
    model: Iframework.plugins.images.GalleryImage,
    localStorage: new Backbone.LocalStorage("GalleryImages")
  });

  var imageTemplate = 
    '<img crossorigin="anonymous" title="drag to graph or image node" />'+
    '<div class="controls">'+
      '<a class="link button icon-link" title="Open image in new window" target="_blank"></a>'+
      '<button class="export-public icon-export" title="Save straight to Flickr, Dropbox, Google, Facebook..."></button>'+
      '<button class="delete icon-trash" title="Delete image"></button>'+
    '</div>';

  Iframework.plugins.images.GalleryImageView = Backbone.View.extend({
    tagName: "div",
    className: "meemoo-plugin-images-thumbnail",
    template: _.template(imageTemplate),
    events: {
      "click .export-public": "exportPublic",
      "click .delete": "destroyModel"
    },
    initialize: function () {
      this.$el.html(this.template(this.model.toJSON()));

      this.$(".link").attr("href", this.model.mainsrc);

      // Load thumbnail
      var img = this.$("img")[0];
      // Using direct link to my S3 instead of file.url
      img.src = this.model.mainsrc;

      this.$el.draggable({
        cursor: "pointer",
        cursorAt: { top: -10, left: -10 },
        helper: function( event ) {
          var helper = $( '<div class="drag-image"><h2>Copy this</h2></div>' )
            .data({
              "meemoo-drag-type": "canvas",
              "meemoo-source-image": img,
              "meemoo-image-url": img.src
            });
          $(document.body).append(helper);
          _.delay(function(){
            dragCopyCanvas(helper);
          }, 100);
          return helper;
        }
      });

      publicListing.append( this.el );

      this.model.on('destroy', this.remove, this);

      return this;
    },
    exportPublic: function(){
      if ( !window.filepicker ) { 
        setInfo("Image service not available.");
        return false; 
      }

      var url = this.model.get("files")["main"]["url"];

      filepicker.exportFile(
        url,
        {mimetype:'image/png'},
        function (file) {}
      );
    },
    destroyModel: function () {
      if (window.confirm("Are you sure you want to delete this image?")) {
        // Delete filepicker file
        if (window.filepicker) {
          var file = this.model.get("files")["main"];
          filepicker.remove(file, function () { });
        }
        // Delete localstorage reference
        this.model.destroy();
      }
    },
    remove: function () {
      this.$el.remove();
    }

  });

  // Load local images from local storage
  var publicImages = new Iframework.plugins.images.GalleryImages();
  publicImages.fetch({
    success: function(e) {
      publicImages.each(function(image){
        image.initializeView();
      });
    },
    error: function (e) {
      console.warn("error loading public images");
    }
  });

}(Iframework) );