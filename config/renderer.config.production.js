const path = require('path')
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackSynchronizableShellPlugin = 
  require('webpack-synchronizable-shell-plugin')
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

    path: path.resolve(__dirname, '../dist')
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.png$|\.jpg$/,
        loader: 'file-loader',
        options: {
          outputPath: './img/'
        }
      }
    ],
  },

  plugins: [
    new UglifyJsPlugin({
      test: /\.jsx?$/
    }),

    new CopyWebpackPlugin([
      { from: 'lib/css/*.css', to: './css/', flatten: true },
      { from: 'src/index.css', to: './css/' }
    ]),

    new HtmlWebpackPlugin({
      title: WINDOW_TITLE,
      filename: 'index.html',
      template: 'src/index.ejs'
    })
  ]
}
