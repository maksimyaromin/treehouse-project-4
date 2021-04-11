/*
    Gulpfile.js 
    Maksim Yaromin
    20.02.2018 22:07 
*/
const gulp = require("gulp");
const del = require("del");
const babel = require("gulp-babel");
const server = require("gulp-webserver");

/* Build tasks
*/
function clean() {
    return del([ "./dist/**/*" ]);;
}

function scripts() {
    return gulp.src("./src/**/*.js", { sourcemaps: false })
        .pipe(babel())
        .on("error", function handleError() {
            this.emit("end");
        })
        .pipe(gulp.dest("./dist"));
}

var build = gulp.series(clean, scripts);

function watch() {
    gulp.watch("./src/**/*.js", build);
}

/* Run app
    
    Lounch simple web server with livereload module 
    on http://localhost:9000 
*/
function startServer() {
    return gulp.src(".")
        .pipe(server({
            livereload: true,
            open: true,
            port: 9000
        }));
}

exports.build = build;
exports.watch = watch;

exports.default = startServer;
