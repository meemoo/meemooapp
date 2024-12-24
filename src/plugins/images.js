$(function () {
  var IMGUR_ID = '9877b5345adf3fc';

  // Shim
  if (!window.URL) {
    window.URL = window.webkitURL || window.msURL || window.oURL || false;
  }

  // prettier-ignore
  var template = $(
    '<div class="meemoo-plugin-images">'+
      '<div class="listing">'+
        '<h2>Local images (not saved)</h2>'+
        '<span style="position:absolute;width:0px;overflow:hidden;"><input type="file" class="file-input-local" accept="image/*" multiple /></span>'+
        '<button class="localfile icon-camera" title="Not public. From computer (or mobile camera).">Choose local image</button> from computer or mobile camera'+
        '<div class="image-drop local-drop"><div class="drop-indicator"><p>drag image here to hold it</p></div></div>'+
        '<div class="thumbnails local-listing"></div>'+
        '<h2>Imgur images (public)</h2>'+
        '<span style="position:absolute;width:0px;overflow:hidden;"><input type="file" class="file-input-public" accept="image/*" multiple /></span>'+
        '<button class="publicfile icon-camera" title="Import from computer (or mobile camera).">Upload</button>'+
        '<div class="info"></div>'+
        '<div class="image-drop public-drop"><div class="drop-indicator"><p class="icon-globe-1">drag image here to save to Imgur</p></div></div>'+
        '<div class="thumbnails public-listing"></div>'+
      '</div>'+
    '</div>'
  );

  // Add menu
  Iframework.addMenu('images', template, 'icon-picture');

  // Set info
  var info = template.find('.info');
  var setInfo = function (string) {
    info.text(string);
  };

  // Open image panel by dragging over show button
  Iframework.$('.show-images').droppable({
    accept: '.canvas, .image',
    tolerance: 'pointer',
    activeClass: 'drop-indicator',
    over: function (event, ui) {
      $(this).trigger('click');
    },
  });

  // Drop panels
  template.find('.image-drop').droppable({
    accept: '.canvas',
    tolerance: 'pointer',
    hoverClass: 'drop-hover',
    activeClass: 'drop-active',
    // Don't also drop on graph
    greedy: true,
  });
  template.find('.public-drop').droppable({
    // also accept img drops
    accept: '.canvas, .image',
  });
  template.find('.local-drop').on('drop', function (event, ui) {
    var image = ui.helper.data('meemoo-drag-canvas');
    if (!image) {
      return false;
    }
    var thumbnail = makeThumbnail(image);
    localListing.append(thumbnail);
  });

  // Make thumbnail element
  var makeThumbnail = function (image) {
    // image can be Image or Canvas
    var el = $('<div class="meemoo-plugin-images-thumbnail canvas">')
      .append(image)
      .draggable({
        cursor: 'pointer',
        cursorAt: {top: -10, left: -10},
        helper: function (event) {
          var helper = $(
            '<div class="drag-image"><h2>Copy this</h2></div>'
          ).data({
            'meemoo-drag-type': 'canvas',
            'meemoo-source-image': image,
          });
          $(document.body).append(helper);
          _.delay(function () {
            dragCopyCanvas(helper);
          }, 100);
          return helper;
        },
      });
    return el;
  };

  var dragCopyCanvas = function (helper) {
    if (!helper) {
      return;
    }
    var image = helper.data('meemoo-source-image');
    var canvasCopy = document.createElement('canvas');
    canvasCopy.width = image.naturalWidth ? image.naturalWidth : image.width;
    canvasCopy.height = image.naturalHeight
      ? image.naturalHeight
      : image.height;
    canvasCopy.getContext('2d').drawImage(image, 0, 0);
    helper.data('meemoo-drag-canvas', canvasCopy);
    helper.append(canvasCopy);
  };

  // Local files
  var fileInput = template.find('.file-input-local');
  var localListing = template.find('.local-listing');
  fileInput.change(function (event) {
    // Load local image
    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
      var img = new Image();
      img.src = window.URL.createObjectURL(files[i]);
      var thumbnail = makeThumbnail(img);
      localListing.append(thumbnail);
    }
  });
  template.find('.localfile').click(function () {
    // Trigger
    fileInput.trigger('click');
  });

  // Native select local files to Imgur
  var fileInputPublic = template.find('.file-input-public');
  fileInputPublic.change(function (event) {
    var files = event.target.files;
    if (files.length < 1) {
      return;
    }
    // Upload them
    setInfo('Uploading...');

    function makeSuccess(fileName) {
      return function (response) {
        if (response.success) {
          saveImgurLocal(response.data);
          setInfo('Uploaded ' + fileName + ' :)');
        } else {
          setInfo('Upload ' + fileName + 'failed :(');
        }
      };
    }

    function makeError(fileName) {
      return function () {
        setInfo('Upload ' + fileName + 'failed :(');
      };
    }

    for (var i = 0, len = files.length; i < len; i++) {
      var file = files[i];
      $.ajax({
        url: 'https://api.imgur.com/3/image',
        type: 'post',
        headers: {
          Authorization: 'Client-ID ' + IMGUR_ID,
        },
        data: file,
        processData: false,
        success: makeSuccess(file.name),
        error: makeError(file.name),
      });
    }
  });
  template.find('.publicfile').click(function () {
    // Trigger
    fileInputPublic.trigger('click');
  });

  function enforceHTTPS(url) {
    if (!url) {
      return;
    }
    var linkSplit = url.split(':');
    if (linkSplit[0] === 'http') {
      linkSplit[0] = 'https';
    }
    return linkSplit.join(':');
  }

  function saveImgurLocal(data) {
    // Make small thumbnail url
    var thumbSplit = data.link.split('.');
    thumbSplit[thumbSplit.length - 2] += 's';
    var linkThumb = thumbSplit.join('.');
    // Make model, add to collection, save to localStorage
    var img = new Iframework.plugins.images.GalleryImage({
      id: data.id,
      deletehash: data.deletehash,
      type: data.type,
      link: enforceHTTPS(data.link),
      linkThumb: enforceHTTPS(linkThumb),
      animated: data.animated,
      gifv: enforceHTTPS(data.gifv),
      mp4: enforceHTTPS(data.mp4),
      webm: enforceHTTPS(data.webm),
    });
    publicImages.add(img);
    img.save();
  }

  // Meemoo drop to Imgur
  template.find('.public-drop').on('drop', function (event, ui) {
    var canvas = ui.helper.data('meemoo-drag-canvas');
    var image = ui.helper.data('meemoo-source-image');
    if (!canvas && !image) {
      return false;
    }

    var b64;

    if (canvas) {
      try {
        b64 = canvas.toDataURL().split(',', 2)[1];
      } catch (error) {
        setInfo(
          'Not able to get image data. Right-click "Save as..." or take a screenshot.'
        );
        return false;
      }
    } else if (image) {
      // Make sure data url
      if (image.src.split(':')[0] !== 'data') {
        return false;
      }

      var split = image.src.split(',', 2);
      var type = split[0].split(':')[1].split(';')[0];
      var ext = type.split('/')[1];
      b64 = split[1];
    }

    if (!b64) {
      return false;
    }

    setInfo('Uploading...');

    $.ajax({
      url: 'https://api.imgur.com/3/image',
      type: 'post',
      headers: {
        Authorization: 'Client-ID ' + IMGUR_ID,
      },
      data: {
        image: b64,
        type: 'base64',
        title: 'made with meemoo.org',
        description: 'browser-based media hacking https://app.meemoo.org/',
      },
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          saveImgurLocal(response.data);
          setInfo('Upload done :)');
        } else {
          setInfo('Upload failed :( save it to your computer');
        }
      },
      error: function () {
        setInfo('Upload failed :( save it to your computer');
      },
    });
  });

  // Globally-accessible functions
  Iframework.plugins.images = {};

  Iframework.plugins.images.GalleryImage = Backbone.Model.extend({
    initialize: function () {
      this.initializeView();
    },
    initializeView: function () {
      if (!this.view) {
        this.view = new Iframework.plugins.images.GalleryImageView({
          model: this,
        });
      }
      return this.view;
    },
  });

  Iframework.plugins.images.GalleryImages = Backbone.Collection.extend({
    model: Iframework.plugins.images.GalleryImage,
    localStorage: new Backbone.LocalStorage('GalleryImages'),
  });

  // prettier-ignore
  var imageTemplate =
    '<img crossorigin="anonymous" title="drag to graph or image node" />'+
    '<div class="controls">'+
      '<a class="link button icon-link" title="Open image in new window" target="_blank"></a>'+
      '<a class="link-animated button icon-right-open" title="Open gifv in new window" target="_blank" style="display:none;"></a>'+
      '<button class="delete icon-trash" title="Delete image"></button>'+
    '</div>';

  Iframework.plugins.images.GalleryImageView = Backbone.View.extend({
    tagName: 'div',
    className: 'meemoo-plugin-images-thumbnail',
    template: _.template(imageTemplate),
    events: {
      'click .delete': 'destroyModel',
    },
    initialize: function () {
      this.$el.html(this.template(this.model.toJSON()));

      var mainsrc = this.model.get('link');
      this.$('.link').attr('href', mainsrc);

      var animated = this.model.get('animated');
      if (animated) {
        var animatedLink = this.model.get('gifv') || mainsrc;
        this.$('.link-animated')
          .attr('href', animatedLink)
          .css({display: 'inline-block'});
      }

      // Load thumbnail
      var img = this.$('img')[0];
      img.src = this.model.get('linkThumb');

      this.$el.draggable({
        cursor: 'pointer',
        cursorAt: {top: -10, left: -10},
        helper: function (event) {
          var helper = $(
            '<div class="drag-image"><h2>Copy this</h2></div>'
          ).data({
            'meemoo-drag-type': 'canvas',
            'meemoo-source-image': img,
            'meemoo-image-url': mainsrc,
          });
          $(document.body).append(helper);
          _.delay(function () {
            dragCopyCanvas(helper);
          }, 100);
          return helper;
        },
      });

      var publicListing = template.find('.public-listing');
      publicListing.prepend(this.el);

      this.model.on('destroy', this.remove, this);

      return this;
    },
    destroyModel: function () {
      if (!window.confirm('Are you sure you want to delete this image?')) {
        return;
      }
      // Delete imgur file
      var deletehash = this.model.get('deletehash');
      if (deletehash) {
        setInfo('Deleting...');
        var model = this.model;
        $.ajax({
          url: 'https://api.imgur.com/3/image/' + deletehash,
          type: 'delete',
          headers: {
            Authorization: 'Client-ID ' + IMGUR_ID,
          },
          success: function (response) {
            if (response.success) {
              model.destroy();
              setInfo('Deleted');
            } else {
              setInfo('Delete failed');
            }
          },
          error: function () {
            setInfo('Delete failed');
          },
        });
        return;
      }
      // Delete localstorage reference
      this.model.destroy();
    },
    remove: function () {
      this.$el.remove();
    },
  });

  // Load local images from local storage
  var publicImages = new Iframework.plugins.images.GalleryImages();
  publicImages.fetch({
    success: function (e) {
      publicImages.each(function (image) {
        image.initializeView();
      });
    },
    error: function (e) {
      console.warn('error loading public images');
    },
  });
});
