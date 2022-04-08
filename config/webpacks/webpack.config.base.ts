/**
 * Base webpack config used across other specific configs
 */

 import webpack from 'webpack';
 import webpackPaths from './webpack.paths';
 
 const configuration: webpack.Configuration = {
 
   stats: 'errors-only',
 
   module: {
     rules: [
       {
         test: /\.[jt]sx?$/,
         exclude: /node_modules/,
         use: {
           loader: 'ts-loader',
           options: {
             // Remove this line to enable type checking in webpack builds
             transpileOnly: true,
           },
         },
       },
     ],
   },
 
   output: {
     path: webpackPaths.srcPath,
     library: {
       type: 'commonjs2',
     },
   },
 
   /**
    * Determine the array of extensions that should be used to resolve modules.
    */
   resolve: {
     extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
     modules: [webpackPaths.srcPath, 'node_modules'],
     alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
     fallback: {
      // "path": require.resolve("path-browserify"),
      //  fs: require.resolve('fs'),
     }
   },
 
   plugins: [
     new webpack.EnvironmentPlugin({
       NODE_ENV: 'production',
     }),
   ],
 };
 
 export default configuration;
 