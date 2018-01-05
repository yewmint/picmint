const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const nodeExternals = require('webpack-node-externals')
const { WINDOW_TITLE } = require('../app.config.json')

module.exports = {
  entry: [
    './src/renderer.js',
  ],
  
  target: 'electron-renderer',

  //externals: [nodeExternals()],

  output: {
    filename: 'js/app.js',
    path: path.resolve(__dirname, '../app')
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
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
    new CopyWebpackPlugin([
      { from: 'lib/css/*.css', to: './css/', flatten: true },
      { from: 'lib/font/*.*', to: './font/', flatten: true },
      { from: 'lib/js/*.*', to: './js/', flatten: true }
    ]),

    new HtmlWebpackPlugin({
      title: WINDOW_TITLE,
      filename: 'index.html',
      template: 'src/index.ejs'
    }),
  ]
}
