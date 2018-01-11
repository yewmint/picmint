const path = require('path')
const webpack = require('webpack')
const MakeDirWebpackPlugin = require('make-dir-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/main.js',

  target: 'electron-main',

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../app')
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: './img/'
        }
      }
    ]
  },

  externals: [nodeExternals()],

  plugins: [
    // new webpack.IgnorePlugin(
    //   /sqlite3/
    // ),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new UglifyJsPlugin(),

    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),

    new MakeDirWebpackPlugin({
      dirs: []
    }),

    new CopyWebpackPlugin([
      { from: 'src/package.json', to: '.' },
      { from: 'src/assets/icon.ico', to: '.' }
    ])
  ]
}
