var gulp = require('gulp');
var ejs = require('gulp-ejs');
var concat = require("gulp-concat");

gulp.task('templates', function() {
  gulp.src('./views/*.ejs')
    .pipe(ejs({}))
    .pipe(gulp.dest('./public/views'))
});

gulp.task("js", function() {
  gulp.src("./javascript/**/*.js")
  .pipe(concat("bundle.js"))
  .pipe(gulp.dest("./public/javascripts/"))
});

gulp.task('default', function(){
  gulp.watch('./views/*.ejs', ['templates', 'js']);
});