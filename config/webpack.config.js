const paths = require( './paths' );
const webpack = require( 'webpack' );
const externals = require( './externals' );
const autoprefixer = require( 'autoprefixer' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP === 'true';

// Export configuration.
module.exports = {
	entry: {
		'/blocks.build': paths.pluginBlocksJs, // 'name' : 'path/file.ext'.
	},
	output: {
		// Add /* filename */ comments to generated require()s in the output.
		pathinfo: true,
		// The dist folder.
		path: paths.pluginDist,
		filename: '[name].js', // [name] = './dist/blocks.build' as defined above.
	},
	// You may want 'eval' instead if you prefer to see the compiled output in DevTools.
	devtool: shouldUseSourceMap ? 'source-map' : false,
	module: {
		rules: [
			{
				test: /\.(js|jsx|mjs)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						// @remove-on-eject-begin
						babelrc: false,
						presets: [ require.resolve( 'babel-preset-cgb' ) ],
						// @remove-on-eject-end
						// This is a feature of `babel-loader` for webpack (not Babel itself).
						// It enables caching results in ./node_modules/.cache/babel-loader/
						// directory for faster rebuilds.
						cacheDirectory: true,
					},
				},
			},
		],
	},
	// Add plugins.
	plugins: [
		// Minify the code.
		new UglifyJsPlugin({
			uglifyOptions: {
				warnings: false,
				ie8: false,
				output: {
					comments: false
				}
			}
		}),
	],
	stats: 'minimal',
	// stats: 'errors-only',
	// Add externals.
	externals: externals,
};
