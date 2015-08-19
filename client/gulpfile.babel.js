import WebpackDevServer from 'webpack-dev-server';
import gulp from 'gulp';
import webpack from 'webpack';

import config from './webpack/webpack.development.config.js';

gulp.task('dev', () => {
  new WebpackDevServer(webpack(config), {
    contentBase: 'code/html',
    publicPath: '/',
    hot: true
  }).listen(3000);
});

gulp.task('default', ['dev'], () => {});
