const gulp = require('gulp');
const watch = require('gulp-watch');

const webpack = require('gulp-webpack');
const gls = require('gulp-live-server');

const webpackConfig = {
  devtool: 'source-map',
  output: {
    filename: 'app.js',
  },
  resolve: {
    extensions: ['', '.jsx', '.js'],
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?optional[]=runtime,stage=1' },
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel?optional[]=runtime,stage=1' },
    ],
  },
};

gulp.task('copy', () => {
  gulp.src('./code/html/**').
    pipe(watch('./code/html/**')).
    pipe(gulp.dest('./cordova/www'));
});

gulp.task('webpack', () => {
  gulp.src('./code/js/index.jsx').
    pipe(webpack(webpackConfig)).
    pipe(gulp.dest('./cordova/www/js'));
});

gulp.task('build', ['copy', 'webpack'], () => {
});

gulp.task('server', ['build'], () => {
  const server = gls.new(['--harmony', 'scripts/server.js']);
  server.start();
});

const tasks = ['copy', 'webpack'];

gulp.task('default', tasks, () => {
});
