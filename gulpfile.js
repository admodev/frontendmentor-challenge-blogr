/** @format */

const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }));
}

function jsTask() {
    return src('app/js/script.js', { sourcemaps: true })
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }));
}

function browsersyncServe(callback) {
    browsersync.init({
        server: {
            baseDir: '.',
        },
    });

    callback();
}

function browsersyncReload(callback) {
    browsersync.reload();

    callback();
}

function watchTask() {
    watch('*.html', browsersyncReload);
    watch(
        ['app/scss/**/*.scss', 'app/js/**/*.js'],
        series(scssTask, jsTask, browsersyncReload)
    );
}

exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);
