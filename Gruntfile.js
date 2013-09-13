(function() {
module.exports = function() {

  var banner = "/*! <%= pkg.title %> <%= pkg.homepage %> - v<%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %> (<%= grunt.template.date('longTime') %>)\n* Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>; Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */\n";

  var grunt = this;

  // Project configuration.
  this.initConfig({
    pkg: this.file.readJSON('package.json'),
    concat: {
      options: {
        stripBanners: true,
        banner: banner
      },
      dist: {
        src: [
          // Libs
          'libs/underscore.js',
          'libs/backbone.js',
          'libs/backbone.localStorage.js',
          'libs/mousetrap.js',
          'libs/spectrum/spectrum.js',
          'libs/jquery.ui.touch-punch.js',
          'libs/jquery.ui.touch-punch.js',
          'libs/js-expression-eval/parser.js',
          // Iframework
          'src/iframework.js',
          'src/iframework-utils.js',
          'src/eventshistory.js',
          'src/local-app.js',
          'src/local-app-view.js',
          'src/graph.js',
          'src/graph-view.js',
          'src/node.js',
          'src/node-view.js',
          'src/node-box.js',
          'src/node-box-view.js',
          'src/node-box-native-view.js',
          'src/node-box-iframe.js',
          'src/node-box-iframe-view.js',
          'src/port.js',
          'src/port-view.js',
          'src/port-in.js',
          'src/port-in-view.js',
          'src/port-out.js',
          'src/port-out-view.js',
          'src/module.js',
          'src/module-view.js',
          'src/edge.js',
          'src/edge-view.js',
          'src/router.js',
          // Nodes (most are loaded dynamically)
          'src/nodes/image.js',
          // Plugins
          'src/plugins/source.js',
          'src/plugins/library.js',
          'src/plugins/images.js',
          // 'src/plugins/towtruck.js',
          // All Iframework loaded
          'src/iframework-last.js'
        ],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: banner,
        report: 'min'
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.min.js': ['build/<%= pkg.name %>.js']
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/*.js', 'src/**/*.js', '!src/nodes/webgl-sphere.js'],
      options: {
        browser: true,
        sub: true,
        globals: {
          // "console": true,
          "_": true,
          "$": true,
          "jQuery": true,
          "Backbone": true,
          "yepnope": true,
          "Iframework": true,
          "Mousetrap": true
        }
      },
      force: {
        options: { force: true },
        files: { src: ['Gruntfile.js', 'src/*.js', 'src/**/*.js', '!src/nodes/webgl-sphere.js'] }
      }
    },
    connect: {
      options : {
        port : 8000,
        hostname : '*' // available from ipaddress:8000 on same network (or name.local:8000)
      },
      uses_defaults: {}
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/*.js', 'src/**/*.js'],
        tasks: ['jshint:force'],
        options: {
          nospawn: true
        }
      }
    }
  });
  
  // Only lint the changed file when watching
  this.event.on('watch', function(action, filepath) {
    grunt.config('jshint.force.files.src', filepath);
  });

  // grunt.event.on('jshint:lint', function() {
  //   grunt.warn(); 
  // });

  this.loadNpmTasks('grunt-contrib-concat');
  this.loadNpmTasks('grunt-contrib-uglify');
  this.loadNpmTasks('grunt-contrib-jshint');
  this.loadNpmTasks('grunt-contrib-connect');
  this.loadNpmTasks('grunt-contrib-watch');

  this.registerTask('dev', ['connect', 'watch']);
  this.registerTask('build', ['concat:dist', 'uglify:dist']);
  this.registerTask('test', ['jshint:all']);
  this.registerTask('default', ['test', 'build']);

};
}).call(this);