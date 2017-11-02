const gulp = require('gulp');
// Include plugins

// JS plugins
const uglify = require('gulp-uglify');
// const jshint = require('gulp-jshint');

// CSS Plugins
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const csscomb = require('gulp-csscomb');
const postcss = require('gulp-postcss');
// Postcss Plugins
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');

// Common Plugins
// const concat = require('gulp-concat');
const rename = require('gulp-rename');

// Webserver plugins
const browserSync = require('browser-sync').create();
const mainBowerFiles = require('main-bower-files');
// End of including plugins

// Inititialization tasks
gulp.task('main-bower-files', function() {
  gulp.src(mainBowerFiles('**/*.js'))
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.extname = ".min.js"
    }))
    .pipe(gulp.dest('app/js'));

  gulp.src(mainBowerFiles('**/*.css'))
    .pipe(cleanCss({debug: true}, function(details) {
      console.log(details.name + ': ' + details.stats.originalSize);
      console.log(details.name + ': ' + details.stats.minifiedSize);
    }))
    .pipe(rename(function(path) {
      path.extname = ".min.css"
    }))
    .pipe(gulp.dest('app/css'));
    return;
});

gulp.task('webserver', function() {
  browserSync.init({
    server: './app',
    files: './app/index.html',
    host: '192.168.1.130',
    port: 3002,
    reloadOnRestart: true
  });

  gulp.watch('./styles/*.scss', ['styles']);
  gulp.watch('./app/*.html').on('change', browserSync.reload);
});

gulp.task('styles', function() {
  return gulp.src(__dirname + '/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('custom.css'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

//Default
gulp.task('default', ['webserver']);

//Task on first time start
gulp.task('init', ['main-bower-files', 'styles'])
