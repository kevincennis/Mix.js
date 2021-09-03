const path = require('path')

module.exports = {
	mode: 'development',
	entry: './src/js/Mix.js',
	devServer: {
		static: './public',
	},
	output: {
		filename: 'Mix.js',
		path: path.resolve(__dirname, 'public/js')
	}
}