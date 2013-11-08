module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: [
      '/*!\n',
      '  Mix.js - v<%= pkg.version %>\n',
      '  <%= grunt.template.today("yyyy-mm-dd") %>\n',
      '  <%= pkg.homepage ? pkg.homepage + "\\n" : "" %>\n',
      '  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n',
      '*/\n\n'
    ].join(''),

    connect: {
      test: {
        options: {
          port: 8888,
          base: '.'
        }
      },
      app: {
        options: {
          port: 8888,
          base: 'public'
        }
      },
    },

    lintspaces: {
      all: {
        src: [
          'Gruntfile.js',
          'test/**/*.js',
          'src/**/*.js'
        ],
        options: {
          newline: true,
          trailingspaces: true,
          indentation: 'spaces',
          spaces: 2,
          ignores: ['js-comments']
        }
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'test/**/*.js',
        'src/**/*.js'
      ]
    },

    preprocess: {
      src: {
        files: {
          'public/js/Mix.js': 'src/js/Mix.js'
        }
      }
    },

    concat: {
      css: {
        src: [
          'src/css/normalize.css',
          'src/css/main.css',
          'src/css/loader.css'
        ],
        dest: 'public/css/Mix.css'
      },
      fixtures: {
        src: [
          'test/fixtures/**/*.js'
        ],
        dest: 'test/fixtures.js'
      },
      test: {
        src: [
          'test/tests/**/*.js'
        ],
        dest: 'test/test.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        sourceMap: 'public/js/Mix.js.map',
        sourceMappingURL: 'Mix.js.map',
        sourceMapPrefix: 2
      },
      dist: {
        src: 'public/js/Mix.js',
        dest: 'public/js/Mix.min.js'
      }
    },

    qunit: {
      all: {
        options: {
          urls: [
            'http://localhost:8888/test/index.html'
          ]
        }
      }
    }

  });

  // plugins
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-lintspaces');
  grunt.loadNpmTasks('grunt-preprocess');

  // testing task
  grunt.registerTask('default', [
    'connect:test',
    'lintspaces',
    'jshint',
    'preprocess:src',
    'concat',
    'uglify',
    'qunit'
  ]);

  grunt.registerTask('build', [
    'lintspaces',
    'jshint',
    'preprocess:src',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('app', [
    'connect:app:keepalive'
  ]);

};
