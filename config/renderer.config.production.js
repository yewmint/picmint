const path = require('path')
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { WINDOW_TITLE } = require('../app.config.json')

module.exports = {
  entry: [
    './src/renderer.js',
  ],
  
  target: 'electron-renderer',

  //externals: [nodeExternals()],

  output: {
    filename: 'js/app.js',
    // the output bundle

    path: path.resolve(__dirname, '../app')
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.png$|\.jpg$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: './img/'
          }
        }
      },
      {
        test: /\.sass$|\.scss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      }
    ],
  },

  plugins: [
    new UglifyJsPlugin({
      test: /\.jsx?$/
    }),

    new CopyWebpackPlugin([
      { from: 'lib/css/*.css', to: './css/', flatten: true },
      { from: 'lib/font/*.*', to: './font/', flatten: true },
      { from: 'lib/js/*.*', to: './js/', flatten: true }
    ]),

    new HtmlWebpackPlugin({
      title: WINDOW_TITLE,
      filename: 'index.html',
      template: 'src/index.ejs'
    })
  ]
}
