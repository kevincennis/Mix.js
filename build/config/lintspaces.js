module.exports = {
  all: {
    src: [
      'Gruntfile.js',
      'test/fixtures/**/*.js',
      'test/tests/**/*.js',
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
};
