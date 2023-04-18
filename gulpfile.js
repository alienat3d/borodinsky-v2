'use strict';

const gulp = require("gulp");
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sync = require('browser-sync').create();

// обработка файлов стилей
const styles = () => {
  return gulp
    .src('source/sass/style.scss') // считывает корневой (главный) SCSS-файл со всеми вложенностями.
    .pipe(plumber()) // отлавливает ошибки, если будут
    .pipe(sourcemap.init()) // включает карты кода (сборка)
    .pipe(sass()) // обрабатываем код в CSS с помощью препроцессора SASS
    .pipe(postcss([autoprefixer()])) // обработка CSS добавляет нужные префиксы
    .pipe(sourcemap.write('.')) // карты кода (запись)
    .pipe(gulp.dest('source/css')) // результат обработанного кода сохраняется
    .pipe(sync.stream()); // обновляет изменения с запущенным локальным сервером
};

exports.styles = styles;

// запуск локального сервера и открытие проекта в браузере
const server = (done) => {
  sync.init({
    server: {
      baseDir: "source",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// слежка за изменением файлов HTML и стилей
const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series('styles'));
  gulp.watch('source/*.html').on('change', sync.reload);
};

exports.default = gulp.series(
  styles, server, watcher
);
