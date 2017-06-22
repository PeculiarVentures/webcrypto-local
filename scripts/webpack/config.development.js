import webpack from 'webpack';
import { ENTRY_PATH } from '../config';

export default {
  devtool: 'eval',
  entry: {
    main: [
      'babel-polyfill',
      ENTRY_PATH,
      'webpack-hot-middleware/client?reload=true',
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  module: {
    loaders: [],
  },
};
