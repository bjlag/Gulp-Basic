'use strict';

//-----------------------------------------------------
// Libraries
//-----------------------------------------------------

const gulp = require( 'gulp' ),
    del = require( 'del' ),
    sass = require( 'gulp-sass' ),
    concat = require( 'gulp-concat' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    minifyCss = require( 'gulp-clean-css' ),
    fileinclude = require('gulp-file-include'),
    favicons = require( 'gulp-favicons' );

const wiredep = require( 'wiredep' ).stream;
const useref = require( 'gulp-useref' );

const bs = require( 'browser-sync' ).create();
const watch = require( 'gulp-watch' );
const gulpif = require( 'gulp-if' );
const uglify = require( 'gulp-uglify' );

const imagemin = require( 'gulp-imagemin' );
const imageminJpeg = require( 'imagemin-jpeg-recompress' );
const imageminPng = require( 'imagemin-pngquant' );


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
    return gulp.src( './src/html/pages/*.html' )
        .pipe( fileinclude() )
        .pipe( gulp.dest( './src' ) );
} );

gulp.task( 'bower', () => {
    // todo: удалить
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
        .pipe( sass() )
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

gulp.task( 'css:libs', () => {
    // todo: если продакшет, то выключить sourcemap
    const libs = [
        './src/libs/normalize-css/normalize.css',
        './src/libs/bootstrap/dist/css/bootstrap.css',
        './src/libs/font-awesome/css/font-awesome.min.css'
    ];

    return gulp.src( libs )
        .pipe( sourcemaps.init() )
        .pipe( concat( 'vendor.min.css' ) )
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

gulp.task( 'fonts', () => {
    const fonts = [
        './src/libs/bootstrap/fonts/**/*',
        './src/libs/font-awesome/fonts/**/*'
    ];

    return gulp.src( fonts )
        .pipe( gulp.dest( './src/assets/fonts' ) );
} );

/**
 * Favicons
 */

gulp.task( 'favicon:clean-resource', () => {
    return del( './src/favicons/icons' );
} );

gulp.task( 'favicon:clean-assets', () => {
    return del( './src/assets/images/favicons' );
} );

gulp.task( 'favicon:generate', [ 'favicon:clean-resource' ], () => {
    return gulp.src( './src/favicons/favicon-master.png' )
        .pipe( favicons( {
            appName: null,                  // Your application's name. `string`
            appDescription: null,           // Your application's description. `string`
            developerName: null,            // Your (or your developer's) name. `string`
            developerURL: null,             // Your (or your developer's) URL. `string`
            background: '#fff',             // Background colour for flattened icons. `string`
            theme_color: '#fff',            // Theme color for browser chrome. `string`
            path: "assets/images/favicons",       // Path for overriding default icons path. `string`
            display: "standalone",          // Android display: "browser" or "standalone". `string`
            orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string`
            start_url: "/?homescreen=1",    // Android start application's URL. `string`
            version: 1.0,                   // Your application's version number. `number`
            logging: false,                 // Print logs to console? `boolean`
            online: false,                  // Use RealFaviconGenerator to create favicons? `boolean`
            preferOnline: false,            // Use offline generation, if online generation has failed. `boolean`
            html: '../../html/includes/favicons.html',
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

gulp.task( 'favicon:move', [ 'favicon:clean-assets' ], () => {
    return gulp.src( './src/favicons/icons/*.+(ico|png|svg|xml)' )
        .pipe( gulp.dest( './src/assets/images/favicons' ) );
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