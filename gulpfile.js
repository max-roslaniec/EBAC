const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const obfuscate = require('gulp-obfuscate');

// Compila e minifica o SASS
function compilaSass() {
    return gulp.src('./source/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./build/styles'));
}

// Comprime e ofusca os arquivos JS
function comprimeJavaScript() {
    return gulp.src('./source/scripts/*.js')
        .pipe(uglify())
        .pipe(obfuscate())
        .pipe(gulp.dest('./build/scripts'));
}

// Comprime imagens com import dinâmico de gulp-imagemin (ESM)
async function comprimeImagens() {
    const imagemin = (await import('gulp-imagemin')).default;
    return gulp.src('./source/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/images'));
}

// Tarefa padrão
function funcaoPadrao(callback) {
    console.log("Executando tarefas com Gulp...");
    callback();
}

// Watch opcional
function watch() {
    gulp.watch('./source/styles/*.scss', gulp.series(compilaSass));
    gulp.watch('./source/scripts/*.js', gulp.series(comprimeJavaScript));
    gulp.watch('./source/images/*', gulp.series(comprimeImagens));
}

// Exports
exports.default = gulp.parallel(compilaSass, comprimeJavaScript, comprimeImagens);
exports.sass = compilaSass;
exports.javascript = comprimeJavaScript;
exports.images = comprimeImagens;
exports.watch = watch;
exports.dizOi = funcaoPadrao;
