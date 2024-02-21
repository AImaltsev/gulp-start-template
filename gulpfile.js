const { src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const watchFiles = require('gulp-watch');
const concat = require('gulp-concat');

// Функция запуска сервера
const browserSyncJob = async () => {
  buildSass();
  buildPug();
  await optimizeImages(); // Ждем завершения оптимизации изображений

  browserSync.init({
    server: "build/"
  });

  watch('src/sass/*.scss', buildSass); // Отслеживание изменений в SASS
  watch('src/pages/*.pug', buildPug); // Отслеживание изменений в Pug
  watch('src/images/**/*', optimizeImages); // Отслеживаем изменения в изображениях
};

// Компилятор SASS
const buildSass = () => {
  console.log('Компиляция SASS');

  return src(['node_modules/normalize.css/normalize.css', 'src/sass/*.scss'])
    .pipe(concat('app.css'))
    .pipe(sass())
    .pipe(dest('build/styles/'))
    .pipe(browserSync.stream());
};

// Компилятор PUG
const buildPug = () => {
  console.log('Компиляция Pug');

  return src('src/pages/*.pug')
    .pipe(pug({
      pretty: true,
      basedir: __dirname
    }))
    .pipe(dest('build/'))
    .pipe(browserSync.stream());
};

// Оптимизация изображений
const optimizeImages = async () => {
  const imagemin = await import('gulp-imagemin');

  return src('src/images/**/*')
    .pipe(imagemin.default()) // Не забудьте использовать .default() для загруженного модуля
    .pipe(dest('build/images/', { base: 'src/images/' }));
};

// Отслеживание изменений в изображениях
const watchImages = () => {
  watchFiles('src/images/**/*', optimizeImages);
};

exports.server = browserSyncJob; // Сервер
exports.build = parallel(buildPug, buildSass, optimizeImages); // Компиляторы
