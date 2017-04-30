'use strict';

const gulp          = require('gulp');
const util          = require('gulp-util');

const sass          = require('gulp-sass');
const imagemin      = require('gulp-imagemin');
const sourcemaps    = require('gulp-sourcemaps');
const flatten       = require('gulp-flatten');

const spawn         = require('child_process').spawn;
const del           = require('del');

const srcBase       = 'src/';
const buildBase     = 'build/';
const publicBase    = buildBase + 'public/';
const vendorBase    = 'vendor/';

const colors        = require('colors');

const paths = {
	html:           './src/public/app/**/*.html',
	img:            './src/public/img/*.*',
	scss:           './src/public/scss/*.scss',
	js:             './src/public/*.js',
	php:            './src/**/*.php'
};

const buildPaths = {
	html:           'build/public/',
	img:            'build/public/img/',
	css:            'build/public/css/',
	js:             'build/public/',
	php:            'build/',
	phpVendor:      'build/vendor/'
};

const buildTasks = ['html','img','sass','php','php:vendor','app'];
const watchTasks = ['watch:html','watch:img','watch:sass','watch:php','watch:php:vendor','watch:app'];

// Handle environment flags '--test' and '--production'.
// Build environment is 'dev' by default.

let TARGET = '';
let isProduction = false;
let isTest = false;
let isDev = false;

if(util.env.production || false) {
	TARGET = 'production';
	isProduction = true;
} else if(util.env.test || false) {
	TARGET = 'test';
	isTest = true;
} else {
	TARGET = 'dev';
	isDev = true;
}

util.log('TARGET:', util.colors.green(`${TARGET}`));

/*************************************/
/* HTML                              */
/*************************************/

gulp.task('html', (done) => {
	gulp.src(paths.html)
		.pipe(flatten())
		.pipe(gulp.dest(buildPaths.html))
		.on('end', done);
});

gulp.task('watch:html', () => {
	gulp.watch(paths.html, gulp.parallel('html'));
});

/*************************************/
/* Images                            */
/*************************************/

gulp.task('img', (done) => {
	gulp.src(paths.img)
		.pipe(imagemin())
		.pipe(gulp.dest(buildPaths.img));
	done();
});

gulp.task('watch:img', () => {
	gulp.watch(paths.img, gulp.parallel('img'));
});

/*************************************/
/* SASS                              */
/*************************************/

gulp.task('sass', (done) => {
	gulp.src(paths.scss)
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(buildPaths.css))
		.on('end', done);
});

gulp.task('watch:sass', () => {
	gulp.watch(paths.scss, gulp.parallel('sass'));
});

/*************************************/
/* Typescript                        */
/*************************************/

function webpack(options, done) {
	let envMod = Object.create( process.env );
	envMod.TARGET = `${TARGET}`
	let cmd = spawn('webpack', options, { env: envMod });
	cmd.stdout.on('data', (data) => {
		process.stdout.write(data.toString());
	});
	cmd.stderr.on('data', (data) => {
		process.stderr.write(colors.red(data.toString()));
	});
	cmd.on('error', (error) => {
		process.stderr.write(colors.red('[Webpack] ' + error));
		return;
	});
	cmd.on('exit', done);
}

gulp.task('app', (done) => {
	webpack(['--config', `src/public/webpack.config.js`], done);
});

gulp.task('watch:app', () => {
	webpack(['--config', `src/public/webpack.config.js`, '--watch'], _=>{});
});

/*************************************/
/* PHP                               */
/*************************************/

gulp.task('php', (done) => {
	gulp.src(paths.php)
		.pipe(gulp.dest(buildPaths.php))
		.on('end', done);
});

gulp.task('watch:php', () => {
	gulp.watch(paths.php, gulp.parallel('php'));
});

gulp.task('php:vendor', (done) => {
	gulp.src('vendor/**/*.*')
		.pipe(gulp.dest(buildPaths.phpVendor))
		.on('end', done);
})

gulp.task('watch:php:vendor', () => {
	gulp.watch(paths.phpVendor, gulp.parallel('php:vendor'));
});

/*************************************/
/* Docker Compose                    */
/*************************************/

function docker(cmdName, done) {
	let cmd = spawn('sudo', ['-E', `bin/${cmdName}.sh`], {
		env: {
			PATH: '/usr/local/bin:'+process.env.PATH,
			GULP_TARGET: TARGET,
			COMPOSE_FILE: `./config/${TARGET}/docker-compose.yml`,
			DOCKER_NAME: `uomi_${TARGET}`
		}
	});
	cmd.stdout.on('data', (data) => {
		process.stdout.write(data.toString());
	});
	cmd.stderr.on('data', (data) => {
		process.stderr.write(colors.red(data.toString()));
	});
	cmd.on('error', (error) => {
		process.stderr.write(colors.red('[Docker] ' + error));
		return;
	});
	cmd.on('exit', done);
}

function dockerSsh() {
	let ssh = spawn('sudo', ['-E', `bin/ssh.sh`], { 
		stdio: [0, 1, 2], 
		env: {
			PATH: '/usr/local/bin:'+process.env.PATH,
			GULP_TARGET: TARGET,
			COMPOSE_FILE: `./config/${TARGET}/docker-compose.yml`,
			DOCKER_NAME: `uomi_${TARGET}`
		}
	});
}

['up', 'halt', 'suspend', 'resume', 'destroy', 'status'].forEach(name => {
	gulp.task('docker:' + name, (done) => {
		docker(name, done);
	});
});

gulp.task('docker:ssh', (done) => {
	dockerSsh();
	done();
});

/*************************************/
/* General                           */
/*************************************/

gulp.task('clean', () => {
	return del(['build/*']);
});


gulp.task('watch', gulp.parallel(watchTasks));
gulp.task('build', gulp.parallel(buildTasks));
gulp.task('default', gulp.parallel('build'));
