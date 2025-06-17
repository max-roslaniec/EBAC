import gulp from 'gulp';
import sass from 'gulp-sass';
import * as dartSass from 'sass';
import clean from 'gulp-clean';
import browserSync from 'browser-sync';
import fs from 'fs/promises';
import path from 'path';

const sassCompiler = sass(dartSass);
const server = browserSync.create();

// Limpa a pasta dist
function cleanDist() {
  console.log('Limpando a pasta dist...');
  return gulp.src('dist', { read: false, allowEmpty: true }) // Modificado para limpar a pasta inteira
    .pipe(clean());
}

// Compila SCSS
function styles() {
  console.log('Compilando SCSS...');
  return gulp.src('src/styles/main.scss')
    .pipe(sassCompiler({ outputStyle: 'compressed' }).on('error', sassCompiler.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(server.stream());
}

// Copia imagens usando Gulp
function images() {
  console.log('Copiando imagens de src/images para dist/images...');
  return gulp.src('src/images/**/*.{jpg,png}', { allowEmpty: true, encoding: false })
    .on('error', (err) => console.error('Erro ao copiar imagens com Gulp:', err.message))
    .pipe(gulp.dest('dist/images'))
    .on('end', () => console.log('Imagens copiadas com sucesso para dist/images!'));
}

// ==========================================================
// NOVA TAREFA PARA COPIAR O HTML
// ==========================================================
function html() {
  console.log('Copiando index.html para dist...');
  return gulp.src('index.html')
    .pipe(gulp.dest('dist'))
    .on('end', () => console.log('index.html copiado com sucesso!'));
}
// ==========================================================

// Verifica integridade das imagens em dist/images
async function verifyImages() {
  console.log('Verificando integridade das imagens em dist/images...');
  try {
    const files = await fs.readdir('dist/images');
    for (const file of files) {
      const filePath = path.join('dist/images', file);
      const stats = await fs.stat(filePath);
      console.log(`Imagem ${file}: Tamanho ${stats.size} bytes`);
    }
  } catch (err) {
    console.error('Erro ao verificar imagens:', err.message);
  }
}

// Inicia o servidor e assiste arquivos
function watchFiles() {
  console.log('Iniciando servidor browser-sync...');
  server.init({
    server: {
      baseDir: './dist', // Apontar para a pasta dist para simular o ambiente de produção
    },
    notify: false,
    port: 3001
  });

  gulp.watch('src/styles/**/*.scss', styles);
  gulp.watch('src/images/**/*.{jpg,png}', gulp.series(images, verifyImages));
  gulp.watch('index.html', html).on('change', server.reload); // Atualizar o HTML na dist
}

// Tarefas exportadas
// Adicionamos a tarefa `html` ao gulp.parallel
export const build = gulp.series(cleanDist, gulp.parallel(styles, images, html));
export const watch = gulp.series(build, watchFiles);
export default build;