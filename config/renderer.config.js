const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const nodeExternals = require('webpack-node-externals')
const { WINDOW_TITLE } = require('../app.config.json')

module.exports = {
  entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:3000',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    './src/renderer.js',
    // the entry point of our app
  ],
  
  target: 'electron-renderer',

  //externals: [nodeExternals()],

  output: {
    filename: 'js/app.js',
    // the output bundle

    path: path.resolve(__dirname, '../dist'),

    publicPath: '/'
    // necessary for HMR to know where to load the hot update chunks
  },

  devtool: 'inline-source-map',

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
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.NoEmitOnErrorsPlugin(),
    // do not emit compiled assets that include errors

    new CopyWebpackPlugin([
      { from: 'lib/css/*.css', to: './css/', flatten: true },
      { from: 'src/index.css', to: './css/' }
    ]),

    new HtmlWebpackPlugin({
      title: WINDOW_TITLE,
      filename: 'index.html',
      template: 'src/index.ejs'
    }),
  ],

  devServer: {
    host: 'localhost',
    port: 3000,

    historyApiFallback: true,
    // respond to 404s with index.html

    hot: true,
    // enable HMR on the server

    contentBase: './dist',
  },
}
