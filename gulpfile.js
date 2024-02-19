const { src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();

//функция запуска сервера
const browserSyncJob = () => {
  browserSync.init({
    server: "build/"
  });

  watch('src/sass/*.scss', buildSass); //Отслеживание изменений в SASS
  watch('src/pages/*.pug', buildPug); //Отслеживание изменений в pug
};

//Компилятор SASS
const buildSass = () => {
  console.log('Компиляция SASS');

  return src('src/sass/*.scss')
    .pipe(sass())
    .pipe(dest('build/styles/'))
    .pipe(browserSync.stream());
}

//Компилятор PUG
const buildPug = () => {
  console.log('Компиляция Pug');

  return src('src/pages/*.pug')
    .pipe(pug({
      pretty: true,
      basedir: __dirname
    }))
    .pipe(dest('build/'))
    .pipe(browserSync.stream());
}

exports.server = browserSyncJob; //Сервер
exports.build = parallel(buildPug, buildSass); //Компиляторы
