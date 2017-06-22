import webpack from 'webpack';
import { OUTPUT_PATH } from '../config';

const print = require('./print')('bundle');

export default config => new Promise((resolve, reject) => {
  webpack(config).run((err, stats) => {
    if (err) {
      return reject(err);
    }
    const _stats = stats.toJson();
    print.log(`Buildtime: ${_stats.time}ms`);

    for (let i = 0; i < _stats.assets.length; i += 1) {
      print.log(`Filename: ${_stats.assets[i].name}, size: ${_stats.assets[i].size}B`);
    }
    print.log(`Source bundled to ${OUTPUT_PATH} dirrectory`);

    return resolve();
  });
});
