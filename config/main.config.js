const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/main.js',

  target: 'electron',

  externals: [nodeExternals()],

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.png$/,
        loader: 'file-loader',
        options: {
          outputPath: './img/'
        }
      }
    ]
  },

  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   comments: false
    // })
  ]
};
