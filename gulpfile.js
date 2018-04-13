const gulp = require('gulp');
const clean = require('gulp-clean');
const livereload = require('gulp-livereload');
const nodemon = require("gulp-nodemon");
const argv = require('yargs').argv;
const ts = require('gulp-typescript');

//Pega o argumento passado no comando listado no package.json
var isProduction = (argv.prod === undefined) ? false : true;

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', ['static'], () => {
    const tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js
        .pipe(gulp.dest('dist'));
});


gulp.task('static', ['clean'], () => {
    return gulp
        .src(['src/**/*.json'])
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
    return gulp
        .src('dist')
        .pipe(clean());
});

gulp.task('build', ['scripts']);

if (isProduction) {
    //Termina de compilar e fecha as tarefas
    gulp.task('default', ['build'], () => {
        setTimeout(() => {
            console.log("Build for production completed successfully!");
        }, 500);
    });
} else {
    //Executa o build sempre que mudar qualquer arquivo json e ts
    gulp.task('watch', ['build'], () => {
        return gulp.watch(['src/**/*.ts', 'src/**/*.json'], ['build']);
    });

    //Reinicia o server com nodemon sempre que terminar a compilação
    gulp.task('default', ['watch'], () => {
        // listen for changes
        livereload.listen();

        // configure nodemon
        nodemon({
            // the script to run the app
            script: 'dist/server.js',
            ext: 'js',
            env: { 'NODE_ENV': 'development' }
        }).on('restart', function () {
            // when the app has restarted, run livereload.
            gulp.src('dist/server.js')
                .pipe(livereload());
        });
    });
}