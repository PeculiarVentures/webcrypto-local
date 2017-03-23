import webpack from 'webpack';
import { ENTRY_PATH } from '../config';

export default {
  devtool: false,
  entry: {
    main: [
      'babel-polyfill',
      ENTRY_PATH,
      'webpack-hot-middleware/client?reload=true',
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        sequences: true,
        booleans: true,
        loops: true,
        unused: true,
        warnings: false,
        drop_console: true,
        unsafe: true,
      },
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: false,
      async: true,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  module: {
    loaders: [],
  },
};
