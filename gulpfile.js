/**
* t4utils - This is a utility class that can be used in conjuntion with content types in the Terminal 4 CMS.
* @version v1.0.2
* @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
* @author Ben Margevicius
* Copyright 2016. MIT licensed.
*/

var gulp = require('gulp'),
	del = require('del'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	gulpif = require('gulp-if'),
	concat = require('gulp-concat'),
	header = require('gulp-header'),
	package = require('./package.json'),
	jsdoc = require('gulp-jsdoc3'),
	jshint = require('gulp-jshint'),
	jshintStylish = require('jshint-stylish'),
    config = require('./gulpconfig.js');

gulp.task('clean', function () {
	return del(config.outputDir + '**/*.js'); //when bottlejs gets its jsdocs fixed update to **/*.js
});

gulp.task('doc', ['clean', 'copy-libs', 'build-utils'],  function(doc) {
	
	
	gulp.src(config.outputDir + "*.js", {read: false})
		.pipe(jsdoc(doc));
});

gulp.task('copy-libs', ['clean'], function () {
	gulp.src('./node_modules/bottlejs/dist/bottle.js')
		.pipe(gulp.dest('./components/libs/'));
});

gulp.task('build-utils', ['clean', 'copy-libs'], function() {		
	return gulp.src(config.components)
		.pipe(jshint()) 	//check our js
		.pipe(jshint.reporter(jshintStylish, {verbose: true})) //report in pretty colors
		.pipe(jshint.reporter('fail'))
		.pipe(concat('T4Utils.' + config.t4version + '.js'))
		.pipe(gulpif(config.isProduction, uglify()))
		.pipe(gulpif(config.isProduction, rename({ suffix: ".min" })))
		.pipe(header(config.banner, { package: package })) //add our commented headers.
		.pipe(gulp.dest(config.outputDir));
});

gulp.task('watch', function() {
	gulp.watch(config.components, ['build-utils']);	
});

gulp.task('default', ['clean', 'copy-libs', 'build-utils', 'doc']);
