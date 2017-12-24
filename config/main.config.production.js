const path = require('path')
const nodeExternals = require('webpack-node-externals')
const MakeDirWebpackPlugin = require('make-dir-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackSynchronizableShellPlugin = 
  require('webpack-synchronizable-shell-plugin')

module.exports = {
  entry: './src/main.js',

  target: 'electron-main',

  externals: [nodeExternals()],

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist'),
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
        { path: './dist/store' },
        { path: './dist/store/pics' },
        { path: './dist/store/thumbs' },
        { path: './dist/store/tmp' },
        { path: './dist/store/tmp/pics' },
        { path: './dist/store/tmp/thumbs' },
      ]
    }),

    new CopyWebpackPlugin([
      { from: 'src/package.json', to: '.', flatten: true }
    ]),

    new WebpackSynchronizableShellPlugin({
      onBuildEnd:{
        scripts: ['cd dist && yarn install'],
        blocking: true,
        parallel: false
      }
    })
  ]
}
