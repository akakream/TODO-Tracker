const { src, dest, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concatCss = require('gulp-concat-css');

// Compile SASS, minify and concat into one file
function css() {
  return src(['node_modules/bootstrap/scss/bootstrap.scss', 
              'src/scss/*.scss'],
              { sourcemaps: true })             // get scss files
    .pipe(sass())                               // compile to css
    .pipe(concatCss('app.min.css'))             // concat into single file
    .pipe(minifyCSS())                          // minify css
    .pipe(dest("src/css"))                      // put files into to src/css
    .pipe(browserSync.stream());                // return transformed stream
}

// Move required js into src/js
function js() {
  return src(['node_modules/jquery/dist/jquery.min.js', 
              'node_modules/bootstrap/dist/js/bootstrap.min.js', 
              'node_modules/popper.js/dist/umd/popper.min.js',
              'src/js/app.js'],
              { sourcemaps: true })              // load required js files
    .pipe(dest('src/js', { sourcemaps: true }))  // put files into src/js
    .pipe(browserSync.stream());                 // return transformed stream
}

// Static Server and watching for filechanges
function serve() {
  browserSync.init({
    server: "./src"
  });
  // recompile scss and update css on filechange
  watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], css);
  // update js on filechange
  watch(['src/js/*.js'], js);
  // reload on filechange
  watch(['src/*.html']).on('change', browserSync.reload);
}

exports.js = js;
exports.css = css;
exports.serve = serve;
exports.default = series(css, js, serve);