const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const { format } = require('date-fns')
const pkg = require('./package.json')

const now = new Date()

module.exports = {
	mode: 'development',
	entry: './src/js/Mix.js',
	devServer: {
		static: {
			directory: path.join(__dirname, 'public')
		}
	},
	devtool: 'inline-source-map',
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
		}),
		new webpack.BannerPlugin({
			banner: `
				/*!
				  Mix.js - v${pkg.version},
				  ${format(now, 'yyyy-MM-dd')},
				  Copyright (c) ${format(now, 'yyyy')} ${pkg.author},
				*/
			`,
		})
	],
}