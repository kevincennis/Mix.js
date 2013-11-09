module.exports = {
  options: {
    banner: '<%= banner %>',
    sourceMap: 'public/js/Mix.min.map',
    sourceMappingURL: 'Mix.min.map',
    sourceMapPrefix: 2
  },
  dist: {
    src: 'public/js/Mix.js',
    dest: 'public/js/Mix.min.js'
  }
};
