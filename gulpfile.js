'use strict';

// БИБЛИОТЕКИ
const gulp = require( 'gulp' );
const del = require( 'del' );
const sass = require( 'gulp-sass' );
const wiredep = require( 'wiredep' ).stream;
const useref = require( 'gulp-useref' );
const autoprefixer = require( 'gulp-autoprefixer' );
const sourcemaps = require( 'gulp-sourcemaps' );
const browserSync = require( 'browser-sync' ).create();
const watch = require( 'gulp-watch' );
const gulpif = require( 'gulp-if' );
const uglify = require( 'gulp-uglify' );
const miniCss = require( 'gulp-csso' );
const runSequence = require( 'run-sequence' );

// НАСТРОЙКИ
const path = {
    dist: {
        root: './dist',
        css: './dist/css'
    },
    src: {
        root: './src',
        html: './src/*.html',
        sass: './src/sass/**/*.+(sass|scss)',
        css: './src/assets/css',
        assets: './src/assets/**/*'
    },
    build: [
        './src/assets/fonts/**/*',
        './src/assets/images/**/*',
        // './src/assets/css/**/*.css',
        './src/*.html'
    ],
    watch: [
        './src/**/*',
        '!./src/lib/**/*'
    ]
};

// ЗАДАЧИ
gulp.task( 'clean', () => {
    return del( path.dist.root );
} );

gulp.task( 'html', () => {
    return gulp.src( path.src.html )
        .pipe( gulp.dest( path.dist.root ) );
} );

gulp.task( 'bower', () => {
    return gulp.src( path.src.root + '/*.html' )
        .pipe( wiredep() )
        .pipe( gulp.dest( path.src.root ) );
} );

gulp.task( 'css', () => {
    return gulp.src( path.src.sass )
        .pipe( sourcemaps.init() )
        .pipe( sass( { outputStyle: 'extended' } ) ).on( 'error', sass.logError )
        .pipe( autoprefixer( { browsers: [ 'last 15 versions', '> 0.1%' ] } ) )
        .pipe( sourcemaps.write( '/' ) )
        .pipe( gulp.dest( path.src.css ) );
} );

gulp.task( 'browser-sync', function () {
    browserSync.init( {
        server: {
            baseDir: path.src.root
        },
        notify: false
    } );
    browserSync.watch( path.watch ).on( 'change', browserSync.reload );
} );

gulp.task( 'watch', () => {
    watch( path.src.sass, () => gulp.start( 'css' ) );
    watch( './bower.json', () => gulp.start( 'bower' ) );
} );

gulp.task( 'build', [ 'clean' ], () => {
    return gulp.src( path.src.html )
        .pipe( useref() )
        .pipe( gulpif( '*.js', uglify() ) )
        .pipe( gulpif( '*.css', miniCss( { comments: false } ) ) )
        .pipe( gulp.dest( path.dist.root ) )
} );

gulp.task( 'dev', [ 'css', 'bower', 'watch', 'browser-sync' ] );