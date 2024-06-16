import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { GenerateSW } from 'workbox-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isProduction = process.env.NODE_ENV === 'production';
const dirname = path.resolve(process.cwd());

const config = {
  entry: './src/index.js',
  watchOptions: {
    aggregateTimeout: 1000,
    poll: 1000,
    ignored: /node_modules/,
  },
  output: {
    path: path.resolve(dirname, 'public'),
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
          'sass-loader',
          'postcss-loader',
        ],
      },
    ],
  },
};

export default () => {
  if (isProduction) {
    config.mode = 'production';
    config.plugins.push(new GenerateSW());
  } else {
    config.mode = 'development';
  }
  return config;
};
