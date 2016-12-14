var gulp = require('gulp');
var babel = require("gulp-babel");
//var sourcemaps = require("gulp-sourcemaps");
//var concat = require("gulp-concat");

gulp.task('js', function(){
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy', function(){
    return gulp.src('../common/**/*.js')
        .pipe(gulp.dest('./src/common/'));
});

gulp.task('watch', function(){
    gulp.watch('src/**/*.js', ['js']);

    gulp.watch('../common/**/*.js', ['copy']);
});
