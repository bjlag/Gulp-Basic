'use strict';

// БИБЛИОТЕКИ
const gulp = require( 'gulp' );
const del = require( 'del' );
const sass = require( 'gulp-sass' );
const wiredep = require( 'wiredep' ).stream;
const useref = require( 'gulp-useref' );
const autoprefixer = require( 'gulp-autoprefixer' );
const sourcemaps = require( 'gulp-sourcemaps' );
const bs = require( 'browser-sync' ).create();
const watch = require( 'gulp-watch' );
const gulpif = require( 'gulp-if' );
const uglify = require( 'gulp-uglify' );
const minifyCss = require( 'gulp-clean-css' );
const imagemin = require( 'gulp-imagemin' );
const imageminJpeg = require( 'imagemin-jpeg-recompress' );
const imageminPng = require( 'imagemin-pngquant' );
const favicon = require( 'gulp-real-favicon' );
const fs = require( 'fs' );
const runSequence = require( 'run-sequence' );
const cache = require( 'gulp-cache' );

// НАСТРОЙКИ
const path = {
    dist: {
        root: './dist',
        css: './dist/css',
        fonts: './dist/fonts',
        images: './dist/images'
    },
    src: {
        root: './src',
        html: './src/*.html',
        sass: './src/sass/**/*.+(sass|scss)',
        css: './src/css',
        fonts: [
            './src/fonts/**/*',
            './src/lib/bootstrap/fonts/**/*'
        ],
        images: './src/images/**/*',
        favicon: {
            dataFile: 'faviconData.json',
            masterPicture: './src/images/favicon-master.png',
            dist: './src/images/'
        }
    },
    php: [
        // './src/include/**/*'
    ],
    watch: [
        './src/сss/*.css',
        './src/*.html',
        '!./src/lib/**/*'
    ]
};

// ЗАДАЧИ
gulp.task( 'clean:dist', () => {
    return del( path.dist.root );
} );

gulp.task( 'clean:cache', ( done ) => {
    return cache.clearAll( done );
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
        .pipe( sass( { outputStyle: 'expanded' } ) ).on( 'error', sass.logError )
        .pipe( autoprefixer( { browsers: [ 'last 15 versions', '> 0.1%' ] } ) )
        .pipe( sourcemaps.write( '/' ) )
        .pipe( gulp.dest( path.src.css ) )
        .pipe( bs.stream() );
} );

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task( 'favicon', function ( done ) {
    favicon.generateFavicon( {
        masterPicture: path.src.favicon.masterPicture,
        dest: path.src.favicon.dist,
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '14%',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#da532c',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    startUrl: '',
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#5bbad5'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: path.src.favicon.dataFile
    }, function () {
        done();
    } );
} );

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task( 'favicon-inject', function () {
    return gulp.src( [ 'TODO: List of the HTML files where to inject favicon markups' ] )
        .pipe( favicon.injectFaviconMarkups( JSON.parse( fs.readFileSync( path.src.favicon.dataFile ) ).favicon.html_code ) )
        .pipe( gulp.dest( 'TODO: Path to the directory where to store the HTML files' ) );
} );

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task( 'favicon-update', function ( done ) {
    const currentVersion = JSON.parse( fs.readFileSync( path.src.favicon.dataFile ) ).version;
    favicon.checkForUpdates( currentVersion, function ( err ) {
        if ( err ) {
            throw err;
        }
    } );
} );

gulp.task( 'browser-sync', function () {
    bs.init( {
        server: {
            baseDir: path.src.root
        },
        notify: false
    } );
    watch( path.watch, bs.reload );
} );

gulp.task( 'watch', () => {
    watch( path.src.sass, () => gulp.start( 'css' ) );
    watch( './bower.json', () => gulp.start( 'bower' ) );
} );

gulp.task( 'build:fonts', () => {
    return gulp.src( path.src.fonts )
        .pipe( gulp.dest( path.dist.fonts ) );
} );

gulp.task( 'build:images', () => {
    return gulp.src( path.src.images )
        .pipe( cache(
            imagemin(
                [
                    imagemin.gifsicle( {
                        interlaced: true
                    } ),
                    imagemin.jpegtran( {
                        progressive: true
                    } ),
                    imageminJpeg( {
                        loops: 5,
                        min: 75,
                        max: 80,
                        quality: 'high'
                    } ),
                    imagemin.svgo(),
                    imagemin.optipng( {
                        optimizationLevel: 3
                    } ),
                    imageminPng( {
                        speed: 5
                    } )
                ],
                {
                    verbose: true
                }
            )
        ) )
        .pipe( gulp.dest( path.dist.images ) );
} );

gulp.task( 'build:php', () => {
    return gulp.src( path.php )
        .pipe( gulp.dest( path.dist.root ) );
} );

gulp.task( 'build:mini', () => {
    return gulp.src( path.src.html )
        .pipe( useref() )
        .pipe( gulpif( '*.js', uglify() ) )
        .pipe( gulpif( '*.css', minifyCss(
            {
                compatibility: 'ie9',
                level: {
                    1: {
                        specialComments: false // удаляем все комментарии
                    }
                }
            },
            ( details ) => {
                console.log( `${ details.name }: ${ details.stats.originalSize }` );
                console.log( `${ details.name }: ${ details.stats.minifiedSize }` );
            } )
        ) )
        .pipe( gulp.dest( path.dist.root ) );
} );

gulp.task( 'build', () => {
    runSequence(
        'clean:dist',
        [ 'build:fonts', 'build:mini', 'build:php' ],
        'build:images'
    );
} );

gulp.task( 'dev', () => {
    runSequence( [ 'css', 'bower' ], 'watch', 'browser-sync' );
} );