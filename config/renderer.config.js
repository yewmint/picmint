const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { WINDOW_TITLE } = require('../app.config.json')

module.exports = {
  entry: './src/renderer.js',
  
  target: 'electron-renderer',

  output: {
    filename: 'js/app.js',
    path: path.resolve(__dirname, '../app')
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
        }
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: './img/'
        }
      }
    ],
  },

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },

  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  
  performance: {
    hints: false
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
