const { src, dest, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');

// Compile SASS & auto-inject into browsers
function css() {
  return src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
    .pipe(sass())                               // compile to css
    .pipe(minifyCSS())                          // minify css
    .pipe(dest("src/css"))                      // put files into to src/css
    .pipe(concat('app.min.css'))                // concat into single file
    .pipe(browserSync.stream());                // return transformed stream
}

// Move required js into src/js
function js() {
  return src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 
              'node_modules/jquery/dist/jquery.min.js', 
              'node_modules/popper.js/dist/umd/popper.min.js'], 
              { sourcemaps: true })              // load required js files
    .pipe(dest('src/js', { sourcemaps: true }))  // put files into src/js
    .pipe(concat('app.min.js'))                  // concat all js files into a single file
    .pipe(browserSync.stream());                 // return transformed stream
}

// Static Server and watching for filechanges
function serve() {
  browserSync.init({
    server: "./src"
  });
  // reload on filechange
  watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], css());
  watch(['src/js/*.js'], js());
  watch(['src/*.html']).on('change', browserSync.reload);
}

exports.js = js;
exports.css = css;
exports.serve = serve;
exports.default = series(serve, css, js);