'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const spawn = require('child_process').spawn;
const opn = require('opn');

var paths = {
    html: 'src/public/*.html',
	img: 'src/public/img/*.*',
    scss: 'src/public/scss/*.scss',
    js: 'src/public/js/*.js',
	php: 'src/*.php'
};

var buildPaths = {
    html: 'build/public/',
	img: 'build/public/img/',
    css: 'build/public/css/',
    js: 'build/public/js/',
	php: 'build/'
};

/*************************************/
/* HTML                              */
/*************************************/

gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest(buildPaths.html));
});

gulp.task('watch:html', function() {
    gulp.watch(paths.html, ['html']);
});

/*************************************/
/* Images                            */
/*************************************/

gulp.task('img', function() {
    return gulp.src(paths.img)
		.pipe(imagemin())
        .pipe(gulp.dest(buildPaths.img));
});

gulp.task('watch:img', function() {
    gulp.watch(paths.img, ['img']);
});

/*************************************/
/* SASS                              */
/*************************************/

gulp.task('sass', function() {
    return gulp.src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(buildPaths.css));
});

gulp.task('watch:sass', function() {
    gulp.watch(paths.scss, ['sass']);
});

/*************************************/
/* Javascript                        */
/*************************************/

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(gulp.dest(buildPaths.js));
});

gulp.task('watch:js', function() {
    gulp.watch(paths.js, ['js']);
});

/*************************************/
/* PHP                               */
/*************************************/

gulp.task('php', function() {
    return gulp.src(paths.php)
        .pipe(gulp.dest(buildPaths.php));
});

gulp.task('watch:php', function() {
    gulp.watch(paths.php, ['php']);
});

/*************************************/
/* Docker Compose                    */
/*************************************/

function docker(cmdName) {
	let cmd = spawn('bin/dev/' + cmdName + '.sh');
	cmd.stdout.on('data', function(data) {
		console.log('> ' + data.toString());
	});
	cmd.stderr.on('data', function(data) {
		console.error('> ' + data.toString());
	});
	cmd.on('error', function(error) {
		console.error('From spawn: ' + error);
		return;
	});
}

function dockerSsh() {
	let ssh = spawn('bin/dev/ssh.sh', [], { stdio: [0, 1, 2] });
}

gulp.task('up', function() {
	docker('up');
});

gulp.task('halt', function() {
	docker('halt');
});

gulp.task('suspend', function() {
	docker('suspend');
});

gulp.task('resume', function() {
	docker('resume');
});

gulp.task('destroy', function() {
	docker('destroy');
});

gulp.task('ssh', function() {
	dockerSsh();
});

/*************************************/
/* General                           */
/*************************************/

gulp.task('clean', function() {
    return del(['build/*']);
});

gulp.task('watch', ['watch:html','watch:img','watch:sass','watch:js','watch:php']);
gulp.task('default', ['html','img','sass','js','php']);
