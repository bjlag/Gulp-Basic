'use strict';

//-----------------------------------------------------
// Libraries
//-----------------------------------------------------

const gulp = require( 'gulp' ),
    plumber = require('gulp-plumber'),
    del = require( 'del' ),
    sass = require( 'gulp-sass' ),
    sassGlob = require('gulp-sass-glob'), //  корректная обработка @import вида './**/*'
    concat = require( 'gulp-concat' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    minifyCss = require( 'gulp-clean-css' ),
    fileinclude = require( 'gulp-file-include' ),
    favicons = require( 'gulp-favicons' ),
    uglify = require( 'gulp-uglify' ),
    gcmq = require( 'gulp-group-css-media-queries' ),
    bs = require( 'browser-sync' ).create(),
    watch = require( 'gulp-watch' ),
    gulpif = require( 'gulp-if' ),
    htmlbeautify = require( 'gulp-html-beautify' ),
    imagemin = require( 'gulp-imagemin' ),
    imageminJpeg = require( 'imagemin-jpeg-recompress' ),
    imageminPng = require( 'imagemin-pngquant' ),
    runSequence = require( 'run-sequence' ),
    cache = require( 'gulp-cache' ),
    argv = require( 'yargs' ).argv;


//-----------------------------------------------------
// Setting
//-----------------------------------------------------

const path = {
    root: {
        dist: './dist',
        src: './src'
    },
    html: {
        ready: './src/*.html',
        tpl: './src/html/pages/*.html'
    },
    fonts: {
        ready: './src/assets/fonts/**/*',
        dist: './dist/assets/fonts',
        src: './src/assets/fonts',
        libs: [
            './src/libs/bootstrap/dist/fonts/**/*',
            './src/libs/font-awesome/fonts/**/*'
        ]
    },
    css: {
        sass: './src/blocks/styles.sass',
        dist: './dist/assets/css',
        src: './src/assets/css',
        libs: [
            './src/libs/normalize-css/normalize.css',
            './src/libs/bootstrap/dist/css/bootstrap.css',
            './src/libs/font-awesome/css/font-awesome.css'
        ]
    },
    js: {
        code: './src/blocks/**/*.js',
        dist: './dist/assets/js',
        src: './src/assets/js',
        libs: [
            './src/libs/jquery/dist/jquery.min.js',
            './src/libs/bootstrap/dist/js/bootstrap.min.js'
        ]
    },
    images: {
        src: './src/assets/images/**/*',
        dist: './dist/assets/images'
    },
    favicons: {
        ready: './src/assets/images/favicons',
        master: './src/favicons/favicon-master.png',
        src: './src/favicons/icons',
        html: '../../html/includes/favicons.html',
        path: 'assets/images/favicons'
    },
    watch: {
        html: './src/html/**/*.html',
        sass: './src/blocks/**/*.+(sass|scss)',
        js: './src/blocks/**/*.js',
        reload: './src/*.html'
    }
};


//-----------------------------------------------------
// Tasks
//-----------------------------------------------------

/**
 * Dev tasks
 */

gulp.task( 'clean:dist', () => {
    return del( path.root.dist );
} );

gulp.task( 'clean:cache', ( done ) => {
    return cache.clearAll( done );
} );

gulp.task( 'html', () => {
    let isProduction = argv.prod,
        srcPath = (isProduction ? path.html.ready : path.html.tpl),
        distPath = (isProduction ? path.root.dist : path.root.src);

    return gulp.src( srcPath )
        .pipe( plumber() )
        .pipe( gulpif( !isProduction, fileinclude() ) )
        .pipe( htmlbeautify( {
            indentSize: 4
        } ) )
        .pipe( gulp.dest( distPath ) )
        .pipe( bs.stream() );
} );

gulp.task( 'fonts', () => {
    let isProduction = argv.prod,
        srcPath = path.fonts.ready,
        distPath = (isProduction ? path.fonts.dist : path.fonts.src);

    if ( !isProduction ) {
        srcPath = path.fonts.libs;
    }

    return gulp.src( srcPath )
        .pipe( plumber() )
        .pipe( gulp.dest( distPath ) );
} );

gulp.task( 'css:main', () => {
    let isProduction = argv.prod,
        distPath = (isProduction ? path.css.dist : path.css.src);

    return gulp.src( path.css.sass )
        .pipe( plumber() )
        .pipe( gulpif( !isProduction, sourcemaps.init() ) )
        .pipe( sassGlob() )
        .pipe( sass() )
        .pipe( concat( 'styles.min.css' ) )
        .pipe( gcmq() )
        .pipe( autoprefixer( { browsers: [ 'last 15 versions', '> 0.1%' ] } ) )
        .pipe( gulpif( isProduction, minifyCss( {
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
            } ) ) )
        .pipe( gulpif( !isProduction, sourcemaps.write( '/' ) ) )
        .pipe( gulp.dest( distPath ) )
        .pipe( bs.stream() );
} );

gulp.task( 'css:libs', () => {
    let isProduction = argv.prod,
        distPath = (isProduction ? path.css.dist : path.css.src),
        libs = path.css.libs;

    return gulp.src( libs )
        .pipe( plumber() )
        .pipe( gulpif( !isProduction, sourcemaps.init() ) )
        .pipe( concat( 'vendor.min.css' ) )
        .pipe( gulpif( isProduction, minifyCss( {
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
            } ) ) )
        .pipe( gulpif( !isProduction, sourcemaps.write( '/' ) ) )
        .pipe( gulp.dest( distPath ) )
        .pipe( bs.stream() );
} );

gulp.task( 'js:main', () => {
    let isProduction = argv.prod,
        distPath = (isProduction ? path.js.dist : path.js.src);

    return gulp.src( path.js.code )
        .pipe( plumber() )
        .pipe( gulpif( !isProduction, sourcemaps.init() ) )
        .pipe( concat( 'main.min.js' ) )
        .pipe( gulpif( isProduction, uglify() ) )
        .pipe( gulpif( !isProduction, sourcemaps.write( '/' ) ) )
        .pipe( gulp.dest( distPath ) )
        .pipe( bs.stream() );
} );

gulp.task( 'js:libs', () => {
    let isProduction = argv.prod,
        distPath = (isProduction ? path.js.dist : path.js.src),
        libs = path.js.libs;

    return gulp.src( libs )
        .pipe( plumber() )
        .pipe( gulpif( !isProduction, sourcemaps.init() ) )
        .pipe( concat( 'vendor.min.js' ) )
        .pipe( gulpif( isProduction, uglify() ) )
        .pipe( gulpif( !isProduction, sourcemaps.write( '/' ) ) )
        .pipe( gulp.dest( distPath ) );
} );

gulp.task( 'browser-sync', () => {
    if ( argv.prod ) {
        console.log( 'Продакшен, задача отменена' );
        return false;
    }

    bs.init( {
        server: {
            baseDir: path.root.src
        },
        notify: false
    } );

    watch( path.watch.html, () => gulp.start( 'html' ) );
    watch( path.watch.sass, () => gulp.start( 'css:main' ) );
    watch( path.watch.js, () => gulp.start( 'js:main' ) );
    watch( path.watch.reload, bs.reload );
} );

/**
 * Favicons
 */

gulp.task( 'favicon:clean', () => {
    return del( [ path.favicons.src, path.favicons.ready ] );
} );

gulp.task( 'favicon:generate', [ 'favicon:clean' ], () => {
    gulp.src( path.favicons.master )
        .pipe( favicons( {
            appName: null,                  // Your application's name. `string`
            appDescription: null,           // Your application's description. `string`
            developerName: null,            // Your (or your developer's) name. `string`
            developerURL: null,             // Your (or your developer's) URL. `string`
            background: '#fff',             // Background colour for flattened icons. `string`
            theme_color: '#fff',            // Theme color for browser chrome. `string`
            path: path.favicons.path,       // Path for overriding default icons path. `string`
            display: "standalone",          // Android display: "browser" or "standalone". `string`
            orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string`
            start_url: "/?homescreen=1",    // Android start application's URL. `string`
            version: 1.0,                   // Your application's version number. `number`
            logging: false,                 // Print logs to console? `boolean`
            online: false,                  // Use RealFaviconGenerator to create favicons? `boolean`
            preferOnline: false,            // Use offline generation, if online generation has failed. `boolean`
            html: path.favicons.html,
            pipeHTML: true,
            replace: true,
            icons: {
                // Platform Options:
                // - offset - offset in percentage
                // - shadow - drop shadow for Android icons, available online only
                // - background:
                //   * false - use default
                //   * true - force use default, e.g. set background for Android icons
                //   * color - set background for the specified icons
                //
                android: false,          // Create Android homescreen icon. `boolean` or `{ offset, background, shadow }`
                appleIcon: false,        // Create Apple touch icons. `boolean` or `{ offset, background }`
                appleStartup: false,     // Create Apple startup images. `boolean` or `{ offset, background }`
                coast: false,            // Create Opera Coast icon with offset 25%. `boolean` or `{ offset, background }`
                //coast: {
                //    offset: 25,
                //    background: '#fff'
                //},
                favicons: true,         // Create regular favicons. `boolean`
                firefox: false,          // Create Firefox OS icons. `boolean` or `{ offset, background }`
                windows: false,          // Create Windows 8 tile icons. `boolean` or `{ background }`
                yandex: false            // Create Yandex browser icon. `boolean` or `{ background }`
            }
        } ) )
        .pipe( gulpif( '*.+(ico|png|svg|xml)', gulp.dest( path.favicons.ready ) ) )
        .pipe( gulp.dest( path.favicons.src ) );
} );

/**
 * Production tasks
 */

gulp.task( 'images', () => {
    return gulp.src( path.images.src )
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
        .pipe( gulp.dest( path.images.dist ) );
} );

/**
 * Main tasks
 */

/**
 * gulp build --prod (продакшен)
 * gulp build (разработка)
 */
gulp.task( 'build', [ 'html', 'fonts', 'css:main', 'css:libs', 'js:main', 'js:libs', ], () => {
    if ( argv.prod ) {
        gulp.start( 'images' );
    } else {
        gulp.start( 'browser-sync' );
    }
} );