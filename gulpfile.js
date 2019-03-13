var ThemeName = 'gutenberg-start-template'
var Host = 'test1.su'

// исходные и сбилженые папки
const dir = {
    src         : 'src/',
    build       : '/var/www/'+Host+'/public_html/wp-content/themes/'+ThemeName+'/'
}
// PHP настройки
const php = {
  src           : dir.src + 'template/**/*.php',
  build         : dir.build
}

const styleInit = {
  src           : dir.src + 'template/style.css',
  build         : dir.build
}


var gulp           = require('gulp'),
	sass           = require('gulp-sass'),
	browsersync    = require('browser-sync'),
	concat         = require('gulp-concat'),
	uglify         = require('gulp-uglify'),
	cleanCSS       = require('gulp-clean-css'),
	rename         = require('gulp-rename'),
	del            = require('del'),
	imagemin       = require('gulp-imagemin'),
	cache          = require('gulp-cache'),
	autoprefixer   = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	newer         = require('gulp-newer'),
	notify         = require("gulp-notify"),
	debug = require('gulp-debug'),
	webpack = require('webpack'),
	webpackStream = require('webpack-stream'),
	webpackConfig = require('./config/webpack.config.js')


const syncOpts = {
  proxy       : Host,
  files       : dir.build + '**/*',
  open        : false,
  notify      : false,
  ghostMode   : false,
  ui: {
    port: 8001
  }
};

gulp.task('browsersync', () => {
    browsersync.init(syncOpts);
});

// копируем PHP файлы
gulp.task('php', () => {
  return gulp.src(php.src)
    .pipe(newer(php.build))
    .pipe(gulp.dest(php.build));
});

// копируем styles.css файлы
gulp.task('styles-css', () => {
  return gulp.src(styleInit.src)
    .pipe(newer(styleInit.build))
    .pipe(gulp.dest(styleInit.build));
});

// Пользовательские скрипты проекта
gulp.task('common-js', function() {
	return gulp.src([
		'src/js/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'));
});

gulp.task('blocks-js', function() {
	return gulp.src('src/template/inc/gutenberg/app/**/*.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('src/js'))
    .pipe(gulp.dest('./js'))
    .pipe(browsersync.reload({ stream: true }));
});

gulp.task('js', ['common-js'], function() {

	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/jquery-validation/dist/jquery.validate.min.js',
		'node_modules/jquery-validation/dist/additional-methods.min.js',
		'node_modules/remodal/dist/remodal.min.js',
		'node_modules/slick-carousel/slick/slick.min.js',
		'src/js/common.min.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('src/js'))
	.pipe(browsersync.reload({ stream: true }));
});

gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.sass')
	.pipe(sass({
		includePaths: [
			'node_modules/bourbon/core',
			'node_modules/node-normalize-scss',
			'node_modules/poly-fluid-sizing',
			'node_modules/remodal/dist/remodal.css',
			'node_modules/remodal/dist/remodal-default-theme.css',
			'node_modules/slick-carousel/slick/slick.scss',
			'node_modules/slick-carousel/slick/slick-theme.scss',
		],
		outputStyle: 'expanded'
	}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('src/css'))
	.pipe(browsersync.stream())
});

gulp.task('watch', ['blocks-js', 'sass', 'js', 'browsersync', 'styles-css'], function() {
	gulp.watch('src/sass/**/*.sass', ['sass']);
	gulp.watch(['src/libs/**/*.js', 'src/js/common.js'], ['js']);
	gulp.watch('src/template/inc/gutenberg/app/**/*.js', ['blocks-js']);
	gulp.watch('src/*.html', browsersync.reload);
	gulp.watch(php.src, ['php'], browsersync ? browsersync.reload : {});
});

gulp.task('imagemin', function() {
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin())) // Cache Images
	.pipe(gulp.dest(dir.build+'/img')); 
});

gulp.task('build', ['blocks-js', 'imagemin', 'sass', 'js', 'php', 'styles-css'], function() {

	var buildFiles = gulp.src([
		'src/*.html',
		]).pipe(gulp.dest(dir.build));

	var buildCss = gulp.src([
		'src/css/main.min.css',
		]).pipe(gulp.dest(dir.build+'/css'));

	var buildJs = gulp.src([
		'src/js/scripts.min.js',
		]).pipe(gulp.dest(dir.build+'/js'));

	var buildBlocksJs = gulp.src([
		'src/js/blocks.build.js',
		]).pipe(gulp.dest(dir.build+'/js'));

	var buildFonts = gulp.src([
		'src/fonts/**/*',
		]).pipe(gulp.dest(dir.build+'/fonts'));

});

// gulp.task('removedist', function() { return del.sync(dir.build); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['build','watch']);
