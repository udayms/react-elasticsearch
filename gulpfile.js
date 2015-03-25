var gulp = require('gulp');
var browserSync = require('browser-sync');


var reload = browserSync.reload;

// Static server
gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: "./",
			index: "index-vanila.html"
		}
	});
});

// process JS files and return the stream.
// gulp.task('js', function () {
//     return gulp.src('js/*js')
//         .pipe(browserify())
//         .pipe(uglify())
//         .pipe(gulp.dest('dist/js'));
// });

// Reload all Browsers
gulp.task('bs-reload', function () {
	browserSync.reload();
});

// use default task to launch BrowserSync and watch JS files
gulp.task('default', ['browser-sync'], function () {

	// add browserSync.reload to the tasks array to make
	// all browsers reload after tasks are complete.
	gulp.watch(["./*.html"], [browserSync.reload]);
});
