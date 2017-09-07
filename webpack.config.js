const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/app/main.js', //input file
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'  //output file
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: '/node_modules/',
        loader: (['style-loader', 'css-loader'])//compiling css to js bundle
      },

      {
        test: /\.scss$/,
        exclude: '/node_modules/',
        loader: (['style-loader', 'css-loader', 'sass-loader'])//compiling less to css with help of less-loader ,so we don't need less.js
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)$/, // fonts loader by link
        loader: "url-loader"
      },

    //  {
       // test: /\.(js)$/,
       // exclude: '/node_modules/',
      //  loader: 'babel-loader', //put js code through babel
      //  query: { presets: ['es2015'], plugins: ["transform-es2015-arrow-functions"] }
     // }
    ]
  }

}