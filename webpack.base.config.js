const path = require('path');

module.exports = {
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json','.ts', '.tsx', '.node'],
        alias: {
            '~native': path.resolve(__dirname, 'native'),
            '~resources': path.resolve(__dirname, 'resources')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                  'thread-loader',
                  {
                    loader: 'esbuild-loader',
                    options: {
                      // cacheDirectory: true,
                      loader: "jsx", // Remove this if you're not using JSX
                      target: "es2015", // Syntax to compile to (see options below for possible values)
                    }
                  }
                ],
                exclude: /node_modules/,
              },
            {
                test: /\.tsx?$|\.ts?$/,
                exclude: /node_modules/,
                use: [
                  'esbuild-loader',
                  {
                    loader: 'ts-loader',
                    options: {
                      transpileOnly: true,
                    },
                  },
                  'thread-loader',
                ],
              },
            // c++模块 .node文件处理
            {
                test: /\.node$/,
                exclude: /node_modules/,
                use: 'node-loader'
            }
        ]
    }
}