const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { publicPath } = require('webpack/lib/RuntimeGlobals');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Pasta onde o bundle será salvo
    publicPath: '/',
  },
  mode: 'development', // Modo de desenvolvimento
  devServer: {
    historyApiFallback: true, // Redireciona todas as solicitações para index.html
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Se você estiver usando Babel
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|jpe?g|gif|svg|webp|bmp|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/templates/index.html',
      inject: 'body',
      favicon: './src/assets/icons/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      filename: 'gifts.html',
      template: './src/templates/gifts.html',
      inject: 'body',
      favicon: './src/assets/icons/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      filename: 'prendas.html',
      template: './src/templates/prendas.html',
      inject: 'body',
      favicon: './src/assets/icons/favicon.ico',
    }),
  ],
};
