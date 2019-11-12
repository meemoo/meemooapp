$(function() {
  var template = '<div class="info" />' + '<div class="videos" />';

  Iframework.NativeNodes['file-lottie'] = Iframework.NativeNodes['file'].extend(
    {
      template: _.template(template),
      info: {
        title: 'lottie',
        description: 'encode animation to lottie.json file',
      },
      _animation: null,
      inputanimation: function(animation) {
        if (!animation || !animation.frames || !animation.frames.length) {
          this._animation = null;
          this.$('.info').text('...');
          return;
        }
        this._animation = animation;
        this.$('.info').text(
          `${animation.width}x${animation.height}, ${animation.frames.length} frames`
        );
      },
      inputbuild: function() {
        if (!this._animation) {
          return;
        }

        const json = animationToLottie(this._animation, this._quality);

        var buffer = new Blob([JSON.stringify(json)], {
          type: 'application/json',
        });
        var url = window.URL.createObjectURL(buffer);
        this._builds.push(url);

        // Send blob URL
        this.send('url', url);

        // Info
        var size = Math.ceil(buffer.size / 2014);
        var info = $(
          `<p><a href="${url}" target="_blank" download="meemoo.lottie.json">Download meemoo.lottie.json (${
            this._animation.frames.length
          } frames, ${String(size)}kb)</a></p>`
        );

        // TODO: delete option w/ window.URL.revokeObjectURL(url);
        this.$('.videos').prepend(info);
      },
      _builds: [],
      inputclear: function() {
        this._builds.forEach(function(url) {
          window.URL.revokeObjectURL(url);
        });
        this._builds = [];

        this._animation = null;
        this.$('.info').text('...');
        this.$('.videos').text('');
      },
      inputs: {
        animation: {
          type: 'animation',
          description: 'animation to compile',
        },
        quality: {
          type: 'number',
          min: 0,
          max: 1,
          step: 0.001,
          default: 0.85,
          description: 'jpg quality',
        },
        build: {
          type: 'bang',
          description: 'compile lottie.json file and prompt download',
        },
        clear: {
          type: 'bang',
          description: 'clear generated URLs',
        },
      },
      outputs: {
        url: {
          type: 'string',
          description: 'local blob url of lottie.json file',
        },
      },
    }
  );
  
  // Modified from https://observablehq.com/@forresto/video-to-lottie
  function animationToLottie(animation, quality) {
    const {width, height, fps, frames} = animation;

    return frames.reduce(
      function(lottie, frame, index) {
        const id = 'fr_' + index;
        const w = width;
        const w2 = Math.floor(w / 2);
        const h = height;
        const h2 = Math.floor(h / 2);
        const jpgData = frame.toDataURL('image/jpeg', quality);

        lottie.assets.push({
          id,
          w,
          h,
          u: '',
          p: jpgData,
          e: 1,
        });

        lottie.layers.push({
          ddd: 0,
          ind: index + 1,
          ty: 2,
          nm: id + '.jpg',
          cl: 'jpg',
          refId: id,
          sr: 1,
          ks: {
            o: {a: 0, k: 100, ix: 11},
            r: {a: 0, k: 0, ix: 10},
            p: {a: 0, k: [w2, h2, 0], ix: 2},
            a: {a: 0, k: [w2, h2, 0], ix: 1},
            s: {a: 0, k: [100, 100, 100], ix: 6},
          },
          ao: 0,
          ip: index,
          op: index + 1,
          st: index,
          bm: 0,
        });

        return lottie;
      },
      {
        v: '5.5.2',
        fr: fps,
        ip: 0,
        op: frames.length,
        w: width,
        h: height,
        nm: '@forresto/movie-to-lottie',
        ddd: 0,
        assets: [],
        layers: [],
        markers: [],
      }
    );
  }
});
