const path = require('path')
const nodeExternals = require('webpack-node-externals')
const MakeDirWebpackPlugin = require('make-dir-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/main.js',

  target: 'electron-main',

  externals: [nodeExternals()],

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../app'),
  },

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
    new MakeDirWebpackPlugin({
      dirs: [
        { path: './app/store' },
        { path: './app/store/pics' },
        { path: './app/store/thumbs' },
        { path: './app/store/tmp' },
        { path: './app/store/tmp/pics' },
        { path: './app/store/tmp/thumbs' },
      ]
    }),

    new CopyWebpackPlugin([
      { from: 'src/package.json', to: '.' }
    ])
  ]
}
