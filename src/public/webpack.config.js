const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const path = require('path');

// https://github.com/webpack/webpack/issues/3460
const { CheckerPlugin } = require('awesome-typescript-loader');

// we're in PROJECT/src/public, we want to be in PROJECT.
const PROJECT_ROOT = path.join(__dirname, '../..');

const DEBUG = false;

function root(p) {
	return path.join(PROJECT_ROOT, p);
}

module.exports = {

	cache: true,
	// devtool: 'cheap-module-source-map',
	target: 'web',

	entry: {
		'polyfills': root('./src/public/app/polyfills.ts'),
		'vendor': root('./src/public/app/vendor.ts'),
		'app': root('./src/public/app/main.ts')
	},

	resolve: {
		extensions: ['.ts', '.js'],
		modules: [
			root('./src/public/app'),
			root('./node_modules')
		],
		alias: {
			'@angular/core$': root('./node_modules/@angular/core/bundles/core.umd.min.js'),
			'@angular/compiler$': root('./node_modules/@angular/compiler/bundles/compiler.umd.min.js'),
			'@angular/common$': root('./node_modules/@angular/common/bundles/common.umd.min.js'),
			'@angular/http$': root('./node_modules/@angular/http/bundles/http.umd.min.js'),
			'@angular/router$': root('./node_modules/@angular/router/bundles/router.umd.min.js'),
			'@angular/forms$': root('./node_modules/@angular/forms/bundles/forms.umd.min.js'),
			'@angular/platform-browser$': root('./node_modules/@angular/platform-browser/bundles/platform-browser.umd.min.js'),
			'@angular/platform-browser-dynamic$': root('./node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js'),
			'@angular/platform-browser/animations$': root('./node_modules/@angular/platform-browser/bundles/platform-browser-animations.umd.min.js'),
			'@angular/animations$': root('./node_modules/@angular/animations/bundles/animations.umd.min.js')
		}
	},

	output: {
		path: root('./build/public'),
		filename: 'js/[name].[hash].js',
		chunkFilename: 'js/[id].[hash].chunk.js'
	},

	module: {
		exprContextCritical: false,
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'awesome-typescript-loader',
						options: {
							configFileName: root('./src/public/tsconfig.json'),
							silent: true
						}
					}
				]
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.png$/, 
				loader: 'file-loader'
			}
		]
	},

	stats: {
		colors: true,
		hash: false,
		version: false,
		timings: false,
		assets: false,
		chunks: false,
		modules: false,
		reasons: false,
		children: false,
		source: false,
		errors: true,
		errorDetails: false,
		warnings: false,
		publicPath: false
	},

	plugins: [

		new webpack.LoaderOptionsPlugin({
			debug: DEBUG
		}),

		new CheckerPlugin(),

		new webpack.NoEmitOnErrorsPlugin(),

		new CleanObsoleteChunks(),

		new webpack.EnvironmentPlugin(['TARGET']),

		new webpack.ContextReplacementPlugin(
			// The (\\|\/) piece accounts for path separators in *nix and Windows
			/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
			root('./src'), // location of your src
			{} // a map of your routes
		),

		new webpack.optimize.CommonsChunkPlugin({
			// name: ['app', 'vendor', 'polyfills']
			name: ['vendor', 'polyfills'],
			minChunks: Infinity
		}),

		new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
			mangle: false,
			// sourceMap: true
		}),

		new HtmlWebpackPlugin({
			template: root('./src/public/index.html')
		})
	]
}