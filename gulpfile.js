const { src, dest, series, parallel, watch } = require('gulp');
const merge = require('merge2');
const browserSync = require('browser-sync').create();
// CSS
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concatCss = require('gulp-concat-css');
const autoprefixer = require('gulp-autoprefixer');
// JS & HTML
const minifyJS = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const minfiyHTML = require('gulp-htmlmin');


// Compile SASS, minify and concat into one file
function css() {
  return src('src/scss/*.scss')
    .pipe(sass({outputStyle: 'expanded'}))  // compile custom SCSS
    .pipe(concatCss('app.min.css'))         // concat into single file 
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))                                     // prefix file       
    .pipe(minifyCSS())                      // minify css
    .pipe(dest("build/css"))                // put file into to build/css
    .pipe(browserSync.stream());            // return transformed stream
}


// Move required js into src/js and minify custom JS
function js() {
  // load js files
  var jquery = src('node_modules/jquery/dist/jquery.min.js');
  var popper = src('node_modules/popper.js/dist/umd/popper.min.js');
  var bootstrap = src('node_modules/bootstrap/dist/js/bootstrap.min.js');
  var app = src('src/js/*.js')
    .pipe(minifyJS());                     // minify js
  
  return merge(jquery, popper, bootstrap, app)
    .pipe(concat('app.min.js'))             // concat all js files
    .pipe(dest('build/js'))                 // put files into build/js
    .pipe(browserSync.stream());            // return transformed stream
}

// minify HTML and put into build folder
function html() {
  return src('src/*.html')                     
    .pipe(minfiyHTML())                     // minify html
    .pipe(dest('build'))                    // put files into build
    .pipe(browserSync.stream());            // return transformed stream
}

// minify HTML and put into build folder
function assets() {
  return src('src/assets/**')                     
    .pipe(dest('build/assets'))             // put files into build
    .pipe(browserSync.stream());            // return transformed stream
}

// static server and watching for filechanges
function serve() {
  browserSync.init({
    server: "./build"
  });                                       // serve build

  watch('src/*.html', html);                // recompile scss on filechange
  watch('src/scss/*.scss', css);            // update js on filechange
  watch('src/js/*.js', js);                 // update html on filechange
  watch('src/assets/*', assets);            // update assets on filechange
}

// exports
exports.html = html;
exports.js = js;
exports.css = css;
exports.assets = assets;
exports.serve = serve;
exports.default = series(parallel(html, assets, css, js), serve);