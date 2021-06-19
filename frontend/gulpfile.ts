/// <binding AfterBuild='bundle' Clean='clean' ProjectOpened='default' />
// gulpfile.ts based on blog by Anton Kanevsky: https://www.toptal.com/javascript/optimize-js-and-css-with-gulp
import gulp from "gulp";
import concat from "gulp-concat";
import minify from "gulp-minify";
import cleanCss from "gulp-clean-css";
import rev from "gulp-rev";
import del from "del";
import sass from "gulp-sass";

gulp.task("clean-js",
    gulp.series(() => {
        return del(["public/build/js/*.js", "assets/ts/**/*.js"]);
    }));

gulp.task("clean-css",
    gulp.series(() => {
        return del(["public/build/css/*.css", "assets/sass/**/*.css"]);
    }));

gulp.task("clean", gulp.series(["clean-js", "clean-css"]));

gulp.task("compile-scss",
    gulp.series(() => {
        return gulp.src("assets/sass/**/*.scss")
            .pipe(sass().on("error", sass.logError))
            .pipe(gulp.dest("assets/sass"));
    }));

gulp.task("pack-js",
    gulp.series("clean-js", () => {
        return gulp.src([
                "node_modules/angular/angular.js",
                "assets/ts/**/*.js"
            ])
            .pipe(concat("bundle.js"))
            .pipe(minify(/*{ ext: { min: "*.js" }, noSource: true }*/))
            .pipe(rev())
            .pipe(gulp.dest("public/build/js"))
            .pipe(rev.manifest("public/build/rev-manifest.json", { merge: true }))
            .pipe(gulp.dest("."));
    }));

gulp.task("pack-css",
    gulp.series("clean-css", "compile-scss", () => {
        return gulp.src(["assets/sass/**/*.css"])
            .pipe(concat("stylesheet.css"))
            .pipe(cleanCss())
            .pipe(rev())
            .pipe(gulp.dest("public/build/css"))
            .pipe(rev.manifest("public/build/rev-manifest.json", { merge: true }))
            .pipe(gulp.dest("."));
    }));

gulp.task("bundle", gulp.series(["pack-css", "pack-js"]));

gulp.task("watch", gulp.series(() =>{
    //gulp.watch("assets/ts/**/*.js", gulp.series(["pack-js"]));
    gulp.watch("assets/sass/**/*.css", gulp.series(["pack-css"]));
}));

gulp.task("default", gulp.series(["watch"]));