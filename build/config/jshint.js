module.exports = {
  options: {
    camelcase: true,
    curly: true,
    eqeqeq: true,
    eqnull: true,
    funcscope: true,
    indent: 2,
    latedef: true,
    maxlen: 80,
    newcap: true,
    quotmark: 'single',
    trailing: true,
    undef: true
  },
  build: {
    files: {src: ['build/**/*.js']},
    options: {
      node: true
    }
  },
  gruntFile: {
    files: {src: ['Gruntfile.js']},
    options: {
      node: true
    }
  },
  fixtures: {
    files: {src: ['test/fixtures/**/*.js']},
    options: {
      browser: true,
      jquery: true
    }
  },
  tests: {
    files: {src:['test/tests/**/*.js']},
    options: {
      browser: true,
      jquery: true,
      globals: {
        App: true,
        equal: true,
        expect: true,
        test: true
      }
    }
  },
  src: {
    files: {src: ['src/**/*.js']},
    options: {
      browser: true,
      jquery: true,
      strict: true,
      globals: {
        App: true,
        Backbone: true,
        Mustache: true
      }
    }
  }
};
