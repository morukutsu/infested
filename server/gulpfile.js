var gulp = require('gulp');
var babel = require("gulp-babel");
//var sourcemaps = require("gulp-sourcemaps");
//var concat = require("gulp-concat");

gulp.task('js', function(){
    return gulp.src(['**/*.js', '!**/{node_modules,node_modules/**}'])
        .pipe(babel())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function(){
    gulp.watch(['**/*.js', '!**/{node_modules,node_modules/**}'], ['js']);
});
