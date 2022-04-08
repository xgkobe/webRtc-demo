// 渲染进程prod环境webpack配置
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');

const entry = {
  index: path.join(__dirname, 'src/renderer/renderer.js'), // 页面入口
};
// 对每一个入口生成一个.html文件
const htmlWebpackPlugin = Object.keys(entry).map(name => new HtmlWebpackPlugin({
  inject: 'body',
  scriptLoading: 'defer',
  template: path.join(__dirname, 'resources/template/index.html'), // template.html是一个很简单的html模版
  minify: false,
  filename: `index.html`,
  chunks: [name]
}));

module.exports = merge(webpackBaseConfig, {
  // devtool: 'none',
  mode: 'production',
  target: 'electron-preload',
  entry,
  output: {
    path: path.join(__dirname, 'dist/renderer/'),
    publicPath: './',
    filename: '[name].index.prod.js', // 输出则是每一个入口对应一个文件夹
    clean: true, // 打包构建前清除dist文件中无用的
  },
  module: { 
    rules: [ // 文件处理规则
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                paths: [
                  path.resolve(__dirname, 'node_modules'),
                  path.resolve(__dirname, 'src', 'styles'),
                ],
              },
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].index.style.css',
      // publicPath: '../'
    }),
    ...htmlWebpackPlugin
  ]
});
