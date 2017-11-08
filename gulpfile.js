const gulp = require('gulp');
// Include plugins

// JS plugins
  //Minify JS
  const uglify = require('gulp-uglify');

// CSS Plugins
  // Sass preprocessor
  const sass = require('gulp-sass');
  // Minify CSS
  const cleanCss = require('gulp-clean-css');
  // Beautify CSS styles
  const csscomb = require('gulp-csscomb');
  // Scss concat files with @import func
  const importResolve = require('import-resolve');
  // Replace url(..path/) in CSS
  const urlAdjust = require('gulp-css-url-adjuster');
  // Postcss Plugins
  const postcss = require('gulp-postcss');
    // Set prefixes using CanIUse base
    const autoprefixer = require('autoprefixer');


// Common Plugins
  // Concat several files in one
  const concat = require('gulp-concat');
  // Rename file
  const rename = require('gulp-rename');
  // Add Main bower.json files in project falder
  const mainBowerFiles = require('main-bower-files');
  // Source map generator
  // const sourcemaps = require('gulp-sourcemaps');


// Webserver plugins
const browserSync = require('browser-sync').create();
// End of including plugins

// Infrastructure
  // Pipeline constructors
    // Applyes passed array of functions to a gulp.src method
    // or gulp.src.pipe(...) pipeline sequence
    const pipeCons = (pipeline, array) => array.reduce((sum, current) => {
      return sum.pipe(current);
    }, pipeline);

    // Basic sass compilation tasks + constructor
    const sassPipeCons = (path, dest, isWebserver = true, funcArray = undefined) => {
    if(path == undefined) {
      console.log('ERROR! sassPipe: Path parameter should be defined');
      return;
    }

    const commonPipe = () => gulp.src(__dirname + path)
      .pipe(sass().on('error', sass.logError))
      .pipe(rename('custom.css'))
      .pipe(urlAdjust({
        prepend: '../img/',
      }));

    const wholePipe = () => {
      const assemblePipe = () => {
        if(!funcArray) {
          return commonPipe().pipe(gulp.dest(dest));
        } else {
          return pipeCons(commonPipe(), funcArray).pipe(gulp.dest(dest));
        }
      };

      return (isWebserver) ? assemblePipe()
                              .pipe(browserSync.stream()) :
                             assemblePipe();
    };

    return wholePipe();
  };

    // Concatinate less, sass, styl files into one base file, using infile import func
    const concatImportCss = (path, dest, ext = 'scss') => {
      if(path == undefined || dest == undefined) {
        console.log('ERROR! concatImportCss: Do not has enough parameters');
        return;
      }

      return importResolve({
        'ext': ext,
        'pathToMain': path,
        'output': dest
      });
    };

  // Functions' arrays
  const postCssPipe = [
    postcss([
      autoprefixer()
    ])
  ];

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
    open: false,
    ui: false,
    server: './app',
    files: './app/index.html',
    host: '192.168.1.130',
    port: 3002,
    reloadOnRestart: true,
    logConnections: true,
  });

  gulp.watch('./styles/*.scss', ['styles']);
  gulp.watch('./js/*.js', ['scripts']);
  gulp.watch('./app/*.html').on('change', browserSync.reload);
});

gulp.task('styles', function() {
  return sassPipeCons('/styles/base.scss', 'app/css');
  //
});

gulp.task('scripts', function() {
  return gulp.src(__dirname + '/js/*.js')
  .pipe(concat('custom.js'))
  .pipe(gulp.dest('app/js'))
  .pipe(browserSync.stream());
})

//Default, runing webserver
gulp.task('default', ['webserver']);

//Task on first time start
gulp.task('init', ['main-bower-files', 'styles']);

//Archiving file in one ZIP

gulp.task('archive', function() {
  concatImportCss('styles/base.scss', 'project/styles/custom.scss');
  sassPipeCons('/styles/base.scss', 'project/styles', true, postCssPipe);
  return;
});
