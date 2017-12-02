const { resolve } = require('path')

const nodeExternals = require('webpack-node-externals')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const IncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const { WINDOW_TITLE } = require('./app.config.json')

let common = {
  devtool: '#source-map',
  target: 'electron',
  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.png$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          outputPath: './img/'
        }
      },
      {
        test: /\.node$/,
        exclude: /node_modules/,
        loader: 'node-loader'
      }
    ]
  }
}

module.exports = [
  {
    ...common,
    entry: {
      'app': './src/renderer.js'
    },
    output: {
      path: resolve('dist'),
      filename: 'js/[name].js',
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'lib/bootstrap.min.css', to: './css/' },
        { from: 'src/index.css', to: './css/' }
      ]),
      new HtmlWebpackPlugin({
        title: WINDOW_TITLE,
        filename: 'index.html',
        template: 'src/index.ejs'
      }),
      new IncludeAssetsPlugin({
        assets: ['css/bootstrap.min.css', 'css/index.css'],
        append: true
      })
    ]
  },
  {
    ...common,
    entry: {
      'main': './src/main.js'
    },
    output: {
      path: resolve('dist'),
      filename: '[name].js',
    },
  }
]