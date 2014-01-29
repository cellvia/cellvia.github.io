module.exports = function (grunt) {
  grunt.initConfig({

    /* Browserify js files
    --------------------------------------------- */
    browserify: {
      vendor: {
        src: ['client/js/vendor/**/*.js'],
        dest: 'server/public/js/desktop-vendor.js',
        options: {
          shim: {
            _: {
              path: 'client/js/vendor/02_underscore.js',
              exports: '_'
            },
            Backbone: {
              path: 'client/js/vendor/03_backbone.js',
              exports: 'Backbone'
            }
          }
        }
      },
      app: {
        src: ['client/js/app/**/*.js'],
        dest: 'server/public/js/desktop-app.js',
        options: {
          transform: ['curryFolder/transform.js']
        }
      },
    },

    /* Compile LESS files into CSS
    --------------------------------------------- */
    less: {
      app: {
        files: {
            'server/public/css/desktop.css': 'client/less/desktop/index.less'
          , 'server/public/css/mobile.css': 'client/less/mobile/index.less'
          , 'server/public/css/print.css': 'client/less/print/index.less'
        }
      },
      vendor: {
        files: {
            'server/public/css/desktop.vendor.css': 'client/less/desktop/vendor.less'
          , 'server/public/css/mobile.vendor.css': 'client/less/mobile/vendor.less'
          , 'server/public/css/print.vendor.css': 'client/less/print/vendor.less'
        }
      }
    },

    /* Watch for changes
    --------------------------------------------- */
    watch: {
      app: {
        files: ['client/js/app/**/*.js'],
        tasks: ['browserify:app']
      },
      vendor: {
        files: ['client/js/vendor/**/*.js'],
        tasks: ['browserify:vendor']
      },
      lessApp: {
        files: ['client/less/**/*.less'],
        tasks: ['less:app']
      },
      lessVendor: {
        files: ['client/less/**/*.less'],
        tasks: ['less:vendor']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['browserify:app', 'less:app']);
  grunt.registerTask('build', ['browserify', 'less']);
};
