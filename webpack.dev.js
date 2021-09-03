const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'development',
	entry: './src/js/Mix.js',
	devServer: {
		static: {
			directory: path.join(__dirname, 'public')
		}
	},
	module: {
		rules: [
			{
			  test: /\.css$/i,
			  use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
	output: {
		filename: 'out/Mix.js',
		path: path.resolve(__dirname, 'public'),
	},
	plugins: [
		new ESLintPlugin(),
		new MiniCssExtractPlugin({
			filename: 'out/Mix.css'
		})
	],
}