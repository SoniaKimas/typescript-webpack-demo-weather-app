const path = require('path');
 
module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    clean: true,
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules|samples/],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // Injects styles into the DOM
          'css-loader',   // Translates CSS into CommonJS modules
          'sass-loader',  // Compiles Sass to CSS
        ],
        exclude: [/samples/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js','jsx','.scss'],
  },
};