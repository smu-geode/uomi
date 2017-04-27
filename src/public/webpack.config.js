const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

function root(__path) {
  return path.join(__dirname, __path);
}

module.exports = {

	devtool: 'source-map',

	entry: {
		'polyfills': './src/public/app/polyfills.ts',
		'vendor': './src/public/app/vendor.ts',
		'app': './src/public/app/main.ts'
	},

	resolve: {
		extensions: ['.ts', '.js']
	},

	output: {
		path: root('build/public'),
		publicPath: '/',
		filename: '[name].[hash].js',
		chunkFileName: '[id].[hash].chunk.js'
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				loaders: [
					{
						loader: 'awesome-typescript-loader',
						options: {
							configFileName: helpers.root('src', 'tsconfig.json')
						}
					},
					'angular2-template-loader'
				]
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			}
		]
	},

	plugins: {
		new webpack.NoEmitOnErrorsPlugin(),

		new webpack.ContextReplacementPlugin(
			// The (\\|\/) piece accounts for path separators in *nix and Windows
			/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
			helpers.root('./src'), // location of your src
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
			template: 'src/index.html'
		})
	}
}