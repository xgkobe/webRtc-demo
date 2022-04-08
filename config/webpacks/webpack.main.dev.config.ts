const path = require('path');
const { EnvironmentPlugin} = require('webpack');
const {merge} = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const webpackBaseConfig = require('./webpack.base.config');
module.exports = merge(webpackBaseConfig, {
    // devtool: 'none',
    mode: 'development',
    target: 'node',
    entry: path.join(__dirname,'src/main/index'),
    output: {
        path: path.join(__dirname, 'dist/main'),
        filename: 'main.dev.js'
    },
    externals: [nodeExternals()],
    plugins: [
        new EnvironmentPlugin({
            NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
            DEBUG: false,
        })    
    ],
    node: {
        __dirname: false,
        __filename: false
    }
})