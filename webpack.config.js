const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = (env, argv) => {
  return {
    entry: './index.js',
    output: {
        filename: argv.mode === 'production' ? './bundle.min.js' : './bundle.js',
        library: 'fpEs',
    },
    mode: argv.mode === 'production' ? 'production' : 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                  'babel-loader',
                ],
            },
        ]
    },
    plugins: [
      new CompressionPlugin({
        cache: true,
      }),
      // new MinifyPlugin({}, {}),
    ],
    optimization: {
      minimizer: [
        // we specify a custom UglifyJsPlugin here to get source maps in production
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          uglifyOptions: {
            compress: true,
            ecma: 5,
            mangle: true
          },
          sourceMap: true
        }),
      ]
    },
  };
};
