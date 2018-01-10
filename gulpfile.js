'use strict';

//-----------------------------------------------------
// Libraries
//-----------------------------------------------------

const gulp = require( 'gulp' ),
    del = require( 'del' ),
    sass = require( 'gulp-sass' ),
    concat = require( 'gulp-concat' );

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
const favicons = require( 'gulp-favicons' );
const fileinclude = require('gulp-file-include');
const gcmq = require('gulp-group-css-media-queries');
const runSequence = require( 'run-sequence' );
const cache = require( 'gulp-cache' );


//-----------------------------------------------------
// Setting
//-----------------------------------------------------

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
        favicons: './src/images/favicons'
    },
    php: [
        // './src/include/**/*'
    ],
    favicons: {
        masterPicture: './src/favicons/favicon-master.png',
        dist: './src/favicons/icons'
    },
    watch: [
        './src/сss/*.css',
        './src/*.html',
        '!./src/lib/**/*'
    ]
};


//-----------------------------------------------------
// Tasks
//-----------------------------------------------------

/**
 * Dev tasks
 */

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

// gulp.task( 'js', () => {
//     return gulp.src( '' )
// } );

gulp.task( 'css:main', () => {
    // todo: если продакшет, то выключить sourcemap
    return gulp.src( './src/blocks/**/*.+(sass|scss)' )
        .pipe( sourcemaps.init() )
        .pipe( sass( { outputStyle: 'expanded' } ) ).on( 'error', sass.logError )
        .pipe( concat( 'styles.min.css' ) )
        .pipe( gcmq() )
        .pipe( autoprefixer( { browsers: [ 'last 15 versions', '> 0.1%' ] } ) )
        .pipe( minifyCss(
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
        )
        .pipe( sourcemaps.write( '/' ) )
        .pipe( gulp.dest( './src/assets/css' ) )
        .pipe( bs.stream() );
} );

/**
 * Favicons
 */

gulp.task( 'favicons:clean-src', () => {
    return del( path.favicons.dist );
} );

gulp.task( 'favicons:clean-dist', () => {
    return del( path.src.favicons );
} );

gulp.task( 'favicons:generate-icons', [ 'favicons:clean-src' ], () => {
    return gulp.src( path.favicons.masterPicture )
        .pipe( favicons( {
            appName: null,                  // Your application's name. `string`
            appDescription: null,           // Your application's description. `string`
            developerName: null,            // Your (or your developer's) name. `string`
            developerURL: null,             // Your (or your developer's) URL. `string`
            background: '#fff',             // Background colour for flattened icons. `string`
            theme_color: '#fff',            // Theme color for browser chrome. `string`
            path: "images/favicons",       // Path for overriding default icons path. `string`
            display: "standalone",          // Android display: "browser" or "standalone". `string`
            orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string`
            start_url: "/?homescreen=1",    // Android start application's URL. `string`
            version: 1.0,                   // Your application's version number. `number`
            logging: false,                 // Print logs to console? `boolean`
            online: false,                  // Use RealFaviconGenerator to create favicons? `boolean`
            preferOnline: false,            // Use offline generation, if online generation has failed. `boolean`
            html: 'inject.html',
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
        .pipe( gulp.dest( path.favicons.dist ) );
} );

gulp.task( 'favicons:move-icons', [ 'favicons:clean-dist' ], () => {
    return gulp.src( path.favicons.dist + '/*.+(ico|png|svg|xml)' )
        .pipe( gulp.dest( path.src.favicons ) );
} );

/**
 * Build tasks
 */

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
        .pipe( gulpif( '*.css', gcmq() ) )
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
        .pipe( fileinclude() )
        .pipe( gulp.dest( path.dist.root ) );
} );

/**
 * Other tasks
 */

gulp.task( 'browser-sync', () => {
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

/**
 * Main tasks
 */

gulp.task( 'build', () => {
    runSequence(
        'clean:dist',
        'favicons:generate-icons',
        'favicons:move-icons',
        'build:images',
        [ 'build:fonts', 'build:mini', 'build:php' ]
    );
} );

gulp.task( 'dev', () => {
    runSequence( [ 'css', 'bower' ], 'watch', 'browser-sync' );
} );