// const path = require('path');
// const webpack = require('webpack');

// module.exports = {
//     entry: {
//       'my-lib': './src/index.ts',
//       'my-lib.min': './src/index.ts'
//     },
//     output: {
//       path: path.resolve(__dirname, '_bundles'),
//       filename: '[name].js',
//       libraryTarget: 'umd',
//       library: 'MyLib',
//       umdNamedDefine: true
//     },
//     resolve: {
//       extensions: ['.ts', '.tsx', '.js']
//     },
//     devtool: 'source-map',
//     // plugins: [
//     //   new webpack.optimize.UglifyJsPlugin({
//     //     minimize: true,
//     //     sourceMap: true,
//     //     include: /\.min\.js$/,
//     //   })
//     // ],
//     module: {
//       loaders: [{
//         test: /\.tsx?$/,
//         loader: 'ts-loader',
//         exclude: /node_modules/,
//         query: {
//           declaration: false,
//         }
//       }]
//     }
//   };


const path = require('path');

module.exports = {
  entry: {
      'maths' : './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist')
//   }
  output: {
          path: path.resolve(__dirname, 'dist'),
          filename: '[name].js',
          libraryTarget: 'umd',
          library: 'maths',
          umdNamedDefine: true
        },
};

  
  
