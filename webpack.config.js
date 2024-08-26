const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',  // Entry point of your application
  output: {
    filename: 'bundle.js',  // Name of the output file
    path: path.resolve(__dirname, 'dist'),  // Output directory
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']  // Resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,  // Match TypeScript files
        use: 'ts-loader', // Use ts-loader for TypeScript
        exclude: /node_modules/
      },
      {
        test: /\.css$/,  // Match CSS files
        use: ['style-loader', 'css-loader']  // Use style-loader and css-loader for CSS
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'  // Use this HTML template
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')  // Serve content from this directory
    },
    compress: true,
    port: 9000,
    historyApiFallback: true  // Fallback for client-side routing
  }
};
