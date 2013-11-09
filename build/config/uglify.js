module.exports = {
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
};
