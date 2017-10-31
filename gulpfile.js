const gulp = require('gulp');
// Include plugins
// const jshint = require('gulp-jshint');
// const sass = require('gulp-sass');
// const concat = require('gulp-concat');
// const uglify = require('gulp-uglify');
// const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

// Simple server
gulp.task('browser-sync', function() {
  browserSync.init({
    server: './app',
    files: './app/index.html',
    host: '192.168.1.130',
    port: 3002,
    reloadOnRestart: true
  });
});

gulp.task('html', function() {
  return gulp.src('./*.html')
  .pipe(reload({stream:true}));
})

gulp.task('live', ['browser-sync'], function() {
  gulp.watch("*.html", ['html']);
})



//Default
// gulp.task('default', ['webserver']);
