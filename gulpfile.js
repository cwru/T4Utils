/** 	
* t4utils - This is a utility class that can be used in conjuntion with content types in the Terminal 4 CMS.
* @version v1.0.0
* @link git+https://github.com/FPBSchoolOfNursing/T4Utils.git
* @author Ben Margevicius
* Copyright 2016. MIT licensed. 
*/

var gulp = require('gulp'),
	del = require('del'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	package = require('./package.json'),    
	jshint = require('gulp-jshint'),	
	jshintStylish = require('jshint-stylish');
	

var config = {	
	t4version: '7.4', //you'll have to config this for your environment
	components: ['./components/base.js', 
				 './components/sitemanager.js',
				 './components/security.js'
				],		
	outputDir: './T4Utils/'	
};

gulp.task('clean', function () {
	return del(config.outputDir + '**/*.js');	
});

gulp.task('build-utils', ['clean'], function() {
	return gulp.src(config.components)
		.pipe(jshint()) 	//check our js
		.pipe(jshint.reporter(jshintStylish, {verbose: true})) //report in pretty colors		
		.pipe(concat('T4Utils.' + config.t4version + '.js'))		
		//.pipe(uglify())		
		.pipe(gulp.dest(config.outputDir));
});

gulp.task('default', ['clean','build-utils']);	