module.exports = [
  'connect:test',
  'lintspaces',
  'jshint',
  'preprocess:src',
  'concat',
  'uglify',
  'qunit'
];
