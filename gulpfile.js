const { src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const watchFiles = require('gulp-watch');

//функция запуска сервера
const browserSyncJob = () => {
  buildSass();
  buildPug();
  optimizeImages();

  browserSync.init({
    server: "build/"
  });

  watch('src/sass/*.scss', buildSass); //Отслеживание изменений в SASS
  watch('src/pages/*.pug', buildPug); //Отслеживание изменений в pug
  watch('src/images/**/*', optimizeImages); // Отслеживаем изменения в изображениях
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

// Оптимизация изображений
const optimizeImages = () => {
  return src('src/images/**/*')
    .pipe(imagemin())
    .pipe(dest('build/images/', { base: 'src/images/' }));
}

// Отслеживание изменений в изображениях
const watchImages = () => {
  watchFiles('src/images/**/*', optimizeImages);
}

exports.server = browserSyncJob; //Сервер
exports.build = parallel(buildPug, buildSass, optimizeImages); //Компиляторы
