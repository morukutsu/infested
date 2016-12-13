var gulp = require('gulp');

gulp.task('js', function(){
    return gulp.src('../common/**/*.js')
        .pipe(gulp.dest('./src/common/'));
});

gulp.task('watch', function(){
    gulp.watch('../common/**/*.js', ['js']);
});
