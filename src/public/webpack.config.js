const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const path = require('path');

// we're in PROJECT/src/public, we want to be in PROJECT.
const PROJECT_ROOT = path.join(__dirname, '../..');

function root(p) {
	return path.join(PROJECT_ROOT, p);
}

module.exports = {

	// devtool: 'source-map',

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
		]
	},

	output: {
		path: root('./build/public'),
		filename: '[name].[hash].js',
		chunkFilename: '[id].[hash].chunk.js'
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
							configFileName: root('./src/public/tsconfig.json')
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

	plugins: [
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
			name: ['app', 'vendor', 'polyfills']
		}),

		new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
			mangle: {
				keep_fnames: true
			}
		}),

		new HtmlWebpackPlugin({
			template: root('./src/public/index.html')
		})
	]
}