module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    // package.json
    pkg: grunt.file.readJSON('package.json'),
    // JS banner
    banner: require('./build/config/banner'),
    // webserver
    connect: require('./build/config/connect'),
    // whitespace rules
    lintspaces: require('./build/config/lintspaces'),
    // JS linting
    jshint: require('./build/config/jshint'),
    // build templated JS files
    preprocess: require('./build/config/preprocess'),
    // concatenate tests and fixtures
    concat: require('./build/config/concat'),
    // minify JS
    uglify: require('./build/config/uglify'),
    // testing config
    qunit: require('./build/config/qunit')
  });

  // plugins
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-lintspaces');
  grunt.loadNpmTasks('grunt-preprocess');

  // default task
  grunt.registerTask('default', require('./build/tasks/default'));
  // build (without tests)
  grunt.registerTask('build', require('./build/tasks/build'));
  // start a webserver for the app
  grunt.registerTask('app', require('./build/tasks/app'));

};
