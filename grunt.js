/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> \n'+
        '*/'
    },
    min: {
      dist: {
        src: [
          '<banner:meta.banner>', 
          // Libs
          'libs/underscore.js',
          'libs/backbone.js',
          'libs/backbone.localStorage.js',
          'libs/mousetrap.js',
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
          'src/port-out-image.js',
          'src/module.js',
          'src/module-view.js',
          'src/edge.js',
          'src/edge-view.js',
          'src/router.js',
          'src/iframework-last.js'
        ],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      // files: '<config:lint.files>',
      // tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        "console": true,
        "_": true,
        "$": true,
        "jQuery": true,
        "Backbone": true,
        "yepnope": true,
        "Iframework": true,
        "_gaq": true,
        "Mousetrap": true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint min');
  grunt.registerTask('serve', 'server watch');

};
