module.exports = {
  css: {
    src: [
      'src/css/fonts.css',
      'src/css/normalize-edit.css',
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
};
