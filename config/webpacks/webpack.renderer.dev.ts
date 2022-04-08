import 'webpack-dev-server';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { merge } from 'webpack-merge';
import { spawn } from 'child_process';
import baseConfig from './webpack.config.base';
import webpackPaths from './webpack.paths';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import checkNodeEnv from '../scripts/check-node-env';

if (process.env.NODE_ENV === 'production') {
  checkNodeEnv('development');
}
const port = process.env.PORT || 1212;
const configuration: webpack.Configuration = {
  externals: {
    'electron': 'require("electron")'
  },
  devtool: 'inline-source-map',
  mode: 'development',
  target: ['web', 'electron-renderer'],
  entry: [
    `webpack-dev-server/client?http://localhost:${port}/dist`,
    'webpack/hot/only-dev-server',
    path.join(webpackPaths.srcRendererPath, 'index.tsx'),
  ],
  output: {
    path: path.join(webpackPaths.distPath, 'renderer'),
    publicPath: '/',
    filename: 'renderer.dev.js',
    library: {
      type: 'umd',
    }
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
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // Images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: path.join('index.html'),
      template: path.join(webpackPaths.srcRendererPath, 'index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      isBrowser: false,
      env: process.env.NODE_ENV,
      isDevelopment: process.env.NODE_ENV !== 'production',
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
    global: true,
  },
  devServer: {
    port,
    compress: true,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    static: {
      publicPath: '/',
    },
    historyApiFallback: {
      verbose: true,
    },
    setupMiddlewares(middlewares) {
      console.log('Starting preload.js builder...');
      const preloadProcess = spawn('npm', ['run', 'start:preload'], {
        shell: true,
        stdio: 'inherit',
      })
        .on('close', (code) => process.exit(code!))
        .on('error', (spawnError) => console.error(spawnError));

      console.log('Starting Main Process...');
      spawn('npm', ['run', 'start:main'], {
        shell: true,
        stdio: 'inherit',
      })
        .on('close', (code) => {
          preloadProcess.kill();
          process.exit(code!);
        })
        .on('error', (spawnError) => console.error(spawnError));
      return middlewares;
    },
  },
}

export default merge(baseConfig, configuration);
