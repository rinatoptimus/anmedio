var gulp = require('gulp'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
  return gulp.src('app/sass/style.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(gulp.dest('app/css'))
});

gulp.task('watch', function () {
  gulp.watch('app/sass/**/*.scss', ['sass']);
});