import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { OUTPUT_PATH, INDEX_HTML_PATH } from '../config';

const debug = require('debug')('webpack-config-builder');

export default (mode) => {
  debug(`Building webpack config in mode '${mode}'`);

  return {
    debug: mode === 'development',
    cache: mode === 'development',
    noInfo: true,
    plugins: [
      new CopyWebpackPlugin([
        {
          from: './src/app/assets',
        },
        {
          from: './src/app/404.html',
        },
        {
          from: './dist/webcrypto-socket.js',
        },
      ]),
      new HtmlWebpackPlugin({
        template: INDEX_HTML_PATH,
        inject: false,
      }),
    ],
    output: {
      path: path.join(__dirname, `../../${OUTPUT_PATH}`),
      filename: '[name].js',
      publicPath: '/',
    },
    resolve: {
      modulesDirectories: ['node_modules'],
      extensions: ['', '.ts', '.tsx', '.js', '.jsx'],
      alias: {
        react: 'preact-compat',
        'react-dom': 'preact-compat',
        'create-react-class': 'preact-compat/lib/create-react-class',
      },
    },
    module: {
      loaders: [{
        test: /\.json?$/,
        loader: 'json',
      }, {
        test: /\.(ts|tsx)$/,
        loader: 'awesome-typescript-loader',
      }, {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }],
    },
  };
};
