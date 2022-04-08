const path = require('path');
const {merge} = require('webpack-merge');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack.main.dev.config');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(webpackDevConfig, {
  // devtool: 'none',
  mode: 'production', // 生产模式
  output: {
    path: path.join(__dirname, 'dist/main'),
    filename: 'main.prod.js' // 生产模式文件名为main.prod.js
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),
    new copyWebpackPlugin({
      patterns:[
        {from: path.join(__dirname,'./src/renderer'),
        to: path.join(__dirname, './dist/main/'),
        }
      ]
    })
  ]
});
