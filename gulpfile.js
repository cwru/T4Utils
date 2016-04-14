/** 	
* t4utils - This is a utility class that can be used in conjuntion with content types in the Terminal 4 CMS.
* @version v1.0.1
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
	jshintStylish = require('jshint-stylish');
	

var config = {	
	t4version: '7.4', //you'll have to config this for your environment
	components: ['./components/javadependencies.js',
				 './components/base.js', 				 
				 './components/sitemanager.js',
				 './components/brokerUtils.js',
				 './components/elementInfo.js',
				 './components/getSectionInfo.js',
				 './components/media.js',
				 './components/security.js'
				],		
	outputDir: './T4Utils/',
	isProduction: (process.env.NODE_ENV === 'production'), //Set from command line like SET NODE_ENV=production. 
	banner: ['/**',
		' * <%= package.name %> - <%= package.description %>',
		' * @version v<%= package.version %>',
		' * @link <%= package.repository.url %>',		
		' * @author <%= package.author %>',		
		' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.',	
		' * Built: ' + new Date() + '.',		
		' */',
		''].join('\n')
};

gulp.task('clean', function () {
	return del(config.outputDir + '**/*.js');	
});

gulp.task('doc', function(cb) {
	gulp.src(config.outputDir + "*.js", {read: false})
		.pipe(jsdoc(cb));
});

gulp.task('build-utils', ['clean'], function() {
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


gulp.task('default', ['clean','build-utils']);	