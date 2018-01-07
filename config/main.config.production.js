const path = require('path')
const webpack = require('webpack')
const MakeDirWebpackPlugin = require('make-dir-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
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
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: './img/'
        }
      }
    ]
  },

  externals: [nodeExternals()],

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),

    new MakeDirWebpackPlugin({
      dirs: []
    }),

    new CopyWebpackPlugin([{ from: 'src/package.json', to: '.' }])
  ]
}
