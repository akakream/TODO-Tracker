const { src, dest, series, watch } = require('gulp');
const merge = require('merge2');
const browserSync = require('browser-sync').create();
// CSS
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concatCss = require('gulp-concat-css');
const autoprefixer = require('gulp-autoprefixer');
// JS
const minifyJS = require('gulp-uglify');
const concat = require('gulp-concat');


// Compile SASS, minify and concat into one file
function css() {
  // bootstrap css
  var bootstrap = src('node_modules/bootstrap/scss/bootstrap.scss')
    .pipe(sass({outputStyle: 'expanded'}))  // compile bootstrap SCSS
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))                                     // prefix
    .pipe(dest("src/css"));                 // put file into src/css

  // custom css
  var app = src('src/scss/*.scss')
    .pipe(sass({outputStyle: 'expanded'}))  // compile custom SCSS
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))                                     // prefix
    .pipe(dest("src/css"))                  // put files into src/css
    .pipe(browserSync.stream());            // return transformed stream
  
  // combined
  return merge(bootstrap, app)
    .pipe(concatCss('app.min.css'))         // concat into single file        
    .pipe(minifyCSS())                      // minify css
    .pipe(dest("src/css"))                  // put file into to src/css
    .pipe(browserSync.stream());            // return transformed stream
}


// Move required js into src/js and minify custom JS
function js() {
  // load js files
  var jquery = src('node_modules/jquery/dist/jquery.min.js');
  var bootstrap = src('node_modules/bootstrap/dist/js/bootstrap.min.js');
  var popper = src('node_modules/popper.js/dist/umd/popper.min.js');
  var app = src('src/js/app.js')
    .pipe(minifyJS())
    .pipe(concat('app.min.js'))
    .pipe(dest('src/js/'));
  
  return merge(bootstrap, jquery, popper, app)  // merge file stream
    .pipe(dest('src/js', { sourcemaps: true })) // put files into src/js
    .pipe(browserSync.stream());                // return transformed stream
}

// Static Server and watching for filechanges
function serve() {
  browserSync.init({
    server: "./src"
  });
  // recompile scss and update css on filechange
  watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], css);
  // update js on filechange
  watch('src/js/app.js', js);
  // reload on filechange
  watch(['src/*.html']).on('change', browserSync.reload);
}


// exports
exports.js = js;
exports.css = css;
exports.serve = serve;
exports.default = series(css, js, serve);