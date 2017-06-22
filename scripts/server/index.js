import path from 'path';
import express from 'express';
import webpack from 'webpack';
import compression from 'compression';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { OUTPUT_PATH } from '../config';

export default (mode, config) => {
  const app = express();
  app.use(compression());

  if (mode === 'development') {
    const compiler = webpack(config);

    app.use(express.static(path.join(__dirname, `../../${OUTPUT_PATH}`)));
    app.use(webpackHotMiddleware(compiler));
    app.use(webpackMiddleware(compiler, {
      publicPath: '/',
      stats: {
        colors: true,
        reasons: false,
        hash: false,
        version: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        cached: false,
        cachedAssets: false,
      },
    }));

    app.use('*', (req, res, next) => {
      const filename = path.join(compiler.outputPath, 'index.html');
      compiler.outputFileSystem.readFile(filename, (err, result) => {
        if (err) {
          return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
      });
    });
  } else {
    app.use(express.static(OUTPUT_PATH));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, `../../${OUTPUT_PATH}/index.html`));
    });
  }

  return new Promise((resolve, reject) => {
    app.listen(3001, err => (
      err ? reject(err) : resolve()
    ));
  });
};
