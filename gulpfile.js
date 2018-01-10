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
    fileinclude = require( 'gulp-file-include' ),
    favicons = require( 'gulp-favicons' ),
    uglify = require( 'gulp-uglify' ),
    gcmq = require( 'gulp-group-css-media-queries' ),
    bs = require( 'browser-sync' ).create(),
    watch = require( 'gulp-watch' ),
    gulpif = require( 'gulp-if' ),
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
        .pipe( gulp.dest( './src' ) )
        .pipe( bs.stream() );
} );

gulp.task( 'css:main', () => {
    const isProduction = argv.prod,
        distPath = (isProduction ? './dist/assets/css' : './src/assets/css');

    return gulp.src( './src/blocks/**/*.+(sass|scss)' )
        .pipe( gulpif( !isProduction, sourcemaps.init() ) )
        .pipe( sass() )
        .pipe( concat( 'styles.min.css' ) )
        .pipe( gcmq() )
        .pipe( autoprefixer( { browsers: [ 'last 15 versions', '> 0.1%' ] } ) )
        .pipe( gulpif( isProduction, minifyCss(
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
            } ) )
        )
        .pipe( gulpif( !isProduction, sourcemaps.write( '/' ) ) )
        .pipe( gulp.dest( distPath ) )
        .pipe( bs.stream() );
} );

gulp.task( 'css:libs', () => {
    const isProduction = argv.prod,
        distPath = (isProduction ? './dist/assets/css' : './src/assets/css'),
        libs = [
            './src/libs/normalize-css/normalize.css',
            './src/libs/bootstrap/dist/css/bootstrap.css',
            './src/libs/font-awesome/css/font-awesome.css'
        ];

    return gulp.src( libs )
        .pipe( gulpif( !isProduction, sourcemaps.init() ) )
        .pipe( concat( 'vendor.min.css' ) )
        .pipe( gulpif( isProduction, minifyCss(
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
            } ) )
        )
        .pipe( gulpif( !isProduction, sourcemaps.write( '/' ) ) )
        .pipe( gulp.dest( distPath ) )
        .pipe( bs.stream() );
} );

gulp.task( 'fonts', () => {
    const fonts = [
        './src/libs/bootstrap/dist/fonts/**/*',
        './src/libs/font-awesome/fonts/**/*'
    ];

    return gulp.src( fonts )
        .pipe( gulp.dest( './src/assets/fonts' ) );
} );

gulp.task( 'js:main', () => {
    const isProduction = argv.prod,
        distPath = (isProduction ? './dist/assets/js' : './src/assets/js');

    return gulp.src( './src/blocks/**/*.js' )
        .pipe( gulpif( !isProduction, sourcemaps.init() ) )
        .pipe( concat( 'main.min.js' ) )
        .pipe( gulpif( isProduction, uglify() ) )
        .pipe( gulpif( !isProduction, sourcemaps.write( '/' ) ) )
        .pipe( gulp.dest( distPath ) )
        .pipe( bs.stream() );
} );

gulp.task( 'js:libs', () => {
    const isProduction = argv.prod,
        distPath = (isProduction ? './dist/assets/js' : './src/assets/js'),
        libs = [
            './src/libs/jquery/dist/jquery.min.js',
            './src/libs/bootstrap/dist/js/bootstrap.min.js'
        ];

    return gulp.src( libs )
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
            baseDir: './src'
        },
        notify: false
    } );

    watch( './src/html/pages/*.html', () => gulp.start( 'html' ) );
    watch( './src/blocks/**/*.+(sass|scss)', () => gulp.start( 'css:main' ) );
    watch( './src/blocks/**/*.js', () => gulp.start( 'js:main' ) );
    watch( './src/*.html', bs.reload );
} );

/**
 * Favicons
 */

gulp.task( 'favicon:clean', () => {
    return del( [ './src/favicons/icons', './src/assets/images/favicons' ] );
} );

gulp.task( 'favicon:generate', [ 'favicon:clean' ], () => {
    gulp.src( './src/favicons/favicon-master.png' )
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
        .pipe( gulpif( '*.+(ico|png|svg|xml)', gulp.dest( './src/assets/images/favicons' ) ) )
        .pipe( gulp.dest( path.favicons.dist ) );
} );

/**
 * Production tasks
 */

gulp.task( 'images', () => {
    return gulp.src( './src/assets/images/**/*' )
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
        .pipe( gulp.dest( './dist/assets/images' ) );
} );

gulp.task( 'dist', [ 'clean:dist' ], () => {
    if ( !argv.prod ) {
        console.log( 'Отмена задачи, не передан параметр --prod' );
        return false;
    }

    gulp.src( './src/*.html' )
        .pipe( gulp.dest( './dist' ) );

    gulp.src( './src/assets/fonts/**/*' )
        .pipe( gulp.dest( './dist/assets/fonts' ) );

    runSequence(
        'dist',
        [
            'css:main',
            'css:libs',
            'js:main',
            'js:libs',
            'images'
        ]
    );
} );

/**
 * Main tasks
 */

gulp.task( 'build', () => {
    if ( argv.prod ) {
        runSequence( 'dist' );
    } else {
        runSequence(
            [
                'html',
                'css:main',
                'css:libs',
                'js:main',
                'js:libs',
                'fonts'
            ],
            'browser-sync'
        );
    }
} );