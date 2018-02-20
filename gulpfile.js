/*
    Gulpfile.js 
    Max Eremin
    20.02.2018 22:07 
*/
const gulp = require("gulp");
const del = require("del");
const babel = require("gulp-babel");
const server = require("gulp-webserver");

/* Build tasks
*/
gulp.task("clean:build", () => {
    del("./dist/**/*");
});

gulp.task("build", ["clean:build"], () => 
    gulp.src("./src/**/*.js")
            .pipe(babel())
            .on("error", function handleError() {
                this.emit("end");
            })
            .pipe(gulp.dest("./dist"))
);

gulp.task("watch:build", () => 
    gulp.watch("./src/**/*.js", ["build"])
);

/* Run app
    
    Lounch simple web server with livereload module 
    on http://localhost:9000 
*/
gulp.task("server:start", () =>
    gulp.src(".")
        .pipe(server({
            livereload: true,
            open: true,
            port: 9000
        }))
);
gulp.task("default", [ "server:start" ]);