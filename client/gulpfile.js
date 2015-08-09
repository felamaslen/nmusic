const gulp = require('gulp');
const watch = require('gulp-watch');
const webpack = require('gulp-webpack');
const gls = require('gulp-live-server');

const webpackConfig = {
  devtool: 'source-map',
  output: {
    filename: 'app.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?optional[]=runtime,stage=1' },
    ],
  },
};

gulp.task('webpack', () => {
  watch('./code/js/**', () => {
    gulp.src('./code/js/index.js').
      pipe(webpack(webpackConfig)).
      pipe(gulp.dest('./cordova/www/js'));
  });
});

gulp.task('copy', () => {
  watch('./code/html/**', () => {
    gulp.src('./code/html/**').
      pipe(gulp.dest('./cordova/www'));
  });
});

gulp.task('build', ['copy', 'webpack'], () => {
});

gulp.task('server', ['build'], () => {
  const server = gls.new(['--harmony', 'scripts/server.js']);
  server.start();
});

gulp.task('default', ['copy', 'webpack'], () => {
});
