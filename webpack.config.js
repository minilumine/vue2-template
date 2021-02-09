const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const DotENVWebpack = require('dotenv-webpack')
const { VueLoaderPlugin } = require('vue-loader')

require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

module.exports = {
  target: 'web',

  entry: path.resolve(__dirname, 'src/app.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
  },

  context: __dirname,
  resolve: {
    extensions: ['.js', '.ts', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      vue$: 'vue/dist/vue.runtime.esm.js',
    },
  },

  mode: process.env.NODE_ENV,
  devtool: isDev ? 'cheap-module-source-map' : false,
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    writeToDisk: true,
    inline: true,
    hot: true,
  },

  plugins: [
    new HTMLWebpackPlugin({ template: path.resolve(__dirname, 'src/index.html') }),
    /* friendly-errors-webpack-plugin does not allow to work hot reload */
    new MiniCSSExtractPlugin(),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'public/icons'),
    //       to: path.resolve(__dirname, 'dist/icons'),
    //     },
    //   ],
    // }),
    new DotENVWebpack(),
    new VueLoaderPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.[jt]s$/,
        loader: 'babel-loader',
        exclude: (file) => /node_modules/.test(file) && !/\.vue\.js/.test(file),
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader', // if idProd MiniCSSExtractPlugin.loader
          /* 
            vue-style-loader is not alternative to style-loader,
            without which сss are not added to html
          */
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g)$/,
        type: 'asset/resource',
        generator: {
          filename: 'icons/[name][ext]',
        },
      },
    ],
  },
}
