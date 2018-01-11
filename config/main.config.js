const path = require('path')
// const webpack = require('webpack')
const MakeDirWebpackPlugin = require('make-dir-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/main.js',

  target: 'electron-main',

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../app'),
    publicPath: '/'
  },

  devtool: 'inline-source-map',

  externals: [nodeExternals()],

  module: {
    loaders: [
      {
        test: /\.js$/,
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

  plugins: [
    // new webpack.IgnorePlugin(
    //   /sqlite3/
    // ),

    new MakeDirWebpackPlugin({
      dirs: []
    }),

    new CopyWebpackPlugin([
      { from: 'src/package.json', to: '.' },
      { from: 'src/assets/icon.ico', to: '.' }
    ])
  ]
}
