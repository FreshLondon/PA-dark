// Requires Gulp v4.
// $ npm uninstall --global gulp gulp-cli
// $ rm /usr/local/share/man/man1/gulp.1
// $ npm install --global gulp-cli
// $ npm install
const {src, dest, watch, series, parallel} = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sasslint = require('gulp-sass-lint');
const cache = require('gulp-cached');
const gulp = require('gulp');
const cssmin = require('gulp-cssmin');
// const rename = require('gulp-rename');

//RUN THIS:
// npm install gulp gulp-sass gulp-autoprefixer gulp-plumber gulp-sass-lint gulp-cached gulp-cssmin


// Compile CSS from Sass.
function buildStyles() {
	return src('scss/*.scss', 'scss/**/*.scss')
		.pipe(plumber()) // Global error listener.
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
		.pipe(dest('dist/'))
}

// Watch changes on all *.scss files and trigger buildStyles() at the end.
function watchFiles() {
	watch(
		['scss/*.scss', 'scss/**/*.scss'],
		{events: 'all', ignoreInitial: false},
		series(buildStyles)
	);
}

// Init Sass linter.
function sassLint() {
	return src(['scss/*.scss', 'scss/**/*.scss'])
		.pipe(cache('sasslint'))
		.pipe(sasslint({
			configFile: '.sass-lint.yml'
		}))
		.pipe(sasslint.format())
		.pipe(sasslint.failOnError());
}

function cssMin() {
	return src(['dist/*.css'])
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist-minified/'));
}

// Export commands.
exports.default = parallel(sassLint, watchFiles); // $ gulp
exports.sass = buildStyles; // $ gulp sass
exports.watch = watchFiles; // $ gulp watch
exports.prod = parallel(cssMin); // $ gulp prod
exports.build = series(buildStyles); // $ gulp build
