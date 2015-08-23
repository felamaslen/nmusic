import WebpackDevServer from 'webpack-dev-server';
import gulp from 'gulp';
import webpack from 'webpack';
import express, { Router as router } from 'express';
import proxy from 'proxy-middleware';
import url from 'url';

import config from './webpack/webpack.development.config.js';

import backend from './code/server/server.js';

gulp.task('dev', () => {
  const app = express();

  backend(app);

  app.use('/', proxy(url.parse('http://localhost:8081/')));

  const frontend = new WebpackDevServer(webpack(config), {
    contentBase: 'code/html',
    publicPath: '/',
    hot: true,
    quiet: false,
    noInfo: false
  });

  frontend.listen(8081, 'localhost', () => {});
  app.listen(8080);
});

gulp.task('default', ['dev'], () => {});

