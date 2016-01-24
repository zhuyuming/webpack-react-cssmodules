const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const Clean = require('clean-webpack-plugin');
const HtmlWebpack = require('html-webpack-plugin');
const ExtractText = require('extract-text-webpack-plugin');

const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: PATHS.app,
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      }
    ]
  },
  plugins: [
    new HtmlWebpack({
      template: 'node_modules/html-webpack-template/index.html',
      title: 'React ESNext',
      appMountId: 'app',
      inject: false
    })
  ]
};

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT
    },
    module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css?modules'],
        include: PATHS.app
      }
    ]
  },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

if(TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, {
    entry: {
      main: PATHS.app
    },
    output: {
      path: PATHS.build,
      filename: '[name].js?[chunkhash]',
      chunkFilename: '[chunkhash].js'
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractText.extract('style', 'css?modules'),
          include: PATHS.app
        }
      ]
    },
    plugins: [
      new Clean([PATHS.build], {
        verbose: false
      }),
      new ExtractText('main.css?[chunkhash]'),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}