'use strict';

const
    gulp = require( 'gulp' ),
    gulpLoadPlugins = require('gulp-load-plugins'),
    del = require( 'del' ),
    bs = require( 'browser-sync' ).create(),
    imageminJpeg = require( 'imagemin-jpeg-recompress' ),
    imageminPng = require( 'imagemin-pngquant' ),

    paths = require( './paths' ),

    plugins = gulpLoadPlugins(),
    tasks = {};

/**
 * Определяем статус сборки - разработка или продакшен.
 * @returns {boolean}
 */
const isProduction = function() {
    return ( process.env.NODE_ENV === 'production' );
};

/**
 * Удаление папки dist
 */
tasks.cleanDist = function() {
    return del( paths.dist );
};

/**
 * Удаления кеша
 */
tasks.cleanCache = function( done ) {
    return plugins.cache.clearAll( done );
};

/**
 * Удаление Favicons
 */
tasks.cleanFavicons = function() {
    return del( [ paths.favicons.src, paths.favicons.ready ] );
};

/**
 * Сборка HTML
 */
tasks.html = function() {
    let src = ( isProduction() ? paths.html.ready : paths.html.tmpl ),
        dist = ( isProduction() ? paths.html.dist : paths.html.src );

    return gulp.src( src )
        .pipe( plugins.plumber() )
        .pipe( plugins.fileInclude() )
        .pipe( plugins.htmlBeautify( {
            indentSize: 4
        } ) )
        .pipe( gulp.dest( dist ) )
        .pipe( bs.stream() );
};

/**
 * Сборка шрифтов
 */
tasks.fonts = function() {
    let src = paths.fonts.ready,
        dist = ( isProduction() ? paths.fonts.dist : paths.fonts.src );

    if ( !isProduction() ) {
        src = paths.fonts.vendor;
    }

    return gulp.src( src )
        .pipe( plugins.plumber() )
        .pipe( gulp.dest( dist ) );
};

/**
 * Сборка основных CSS
 */
tasks.cssMain = function() {
    let dist = ( isProduction() ? paths.css.dist : paths.css.src );

    return gulp.src( paths.css.sass )
        .pipe( plugins.plumber() )
        .pipe( plugins.if( !isProduction(), plugins.sourcemaps.init() ) )
        .pipe( plugins.sassGlob( {
                ignorePaths: [
                    '_*.+(sass|scss)' // исключить из обработки базовые импорты
                ]
            } )
        )
        .pipe( plugins.sass() )
        .pipe( plugins.concat( 'main.css' ) )
        .pipe( plugins.groupCssMediaQueries() )
        .pipe( plugins.autoprefixer( { browsers: [ 'last 15 versions', '> 0.1%' ] } ) )
        .pipe( gulp.dest( dist ) )

        .pipe( plugins.cleanCss( {
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
        .pipe( plugins.rename( { suffix: '.min' } ) )
        .pipe( plugins.if( !isProduction(), plugins.sourcemaps.write( '.' ) ) )
        .pipe( gulp.dest( dist ) )

        .pipe( bs.stream() );
};

/**
 * Сборка вендорных CSS
 */
tasks.cssVendor = function() {
    let dist = ( isProduction() ? paths.css.dist : paths.css.src ),
        src = paths.css.vendor;

    return gulp.src( src )
        .pipe( plugins.plumber() )
        .pipe( plugins.if( !isProduction(), plugins.sourcemaps.init() ) )
        .pipe( plugins.if( '**/*.+(sass|scss)', plugins.sass() ) )
        .pipe( plugins.concat( 'vendor.css' ) )
        .pipe( gulp.dest( dist ) )

        .pipe( plugins.rename( { suffix: '.min' } ) )
        .pipe( plugins.cleanCss( {
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
        .pipe( plugins.if( !isProduction(), plugins.sourcemaps.write( '.' ) ) )
        .pipe( gulp.dest( dist ) )

        .pipe( bs.stream() );
};

/**
 * Сборка основных JS
 */
tasks.jsMain = function() {
    let dist = ( isProduction() ? paths.js.dist : paths.js.src );

    return gulp.src( paths.js.code )
        .pipe( plugins.plumber() )
        .pipe( plugins.if( !isProduction(), plugins.sourcemaps.init() ) )
        .pipe( plugins.concat( 'main.js' ) )
        .pipe( gulp.dest( dist ) )

        .pipe( plugins.rename( { suffix: '.min' } ) )
        .pipe( plugins.uglify() )
        .pipe( plugins.if( !isProduction(), plugins.sourcemaps.write( '.' ) ) )
        .pipe( gulp.dest( dist ) )

        .pipe( bs.stream() );
};

/**
 * Сборка вендорных JS
 */
tasks.jsVendor = function() {
    let dist = ( isProduction() ? paths.js.dist : paths.js.src ),
        src = paths.js.vendor;

    return gulp.src( src )
        .pipe( plugins.plumber() )
        .pipe( plugins.if( !isProduction(), plugins.sourcemaps.init() ) )
        .pipe( plugins.concat( 'vendor.js' ) )
        .pipe( gulp.dest( dist ) )

        .pipe( plugins.rename( { suffix: '.min' } ) )
        .pipe( plugins.uglify() )
        .pipe( plugins.if( !isProduction(), plugins.sourcemaps.write( '.' ) ) )
        .pipe( gulp.dest( dist ) );
};

/**
 * Оптимизация изображений
 */
tasks.images = function() {
    return gulp.src( paths.images.src )
        .pipe( plugins.cache(
            plugins.imagemin(
                [
                    plugins.imagemin.gifsicle( { interlaced: true } ),
                    plugins.imagemin.jpegtran( { progressive: true } ),
                    imageminJpeg( {
                        loops: 5,
                        min: 75,
                        max: 80,
                        quality: 'high'
                    } ),
                    plugins.imagemin.svgo(),
                    plugins.imagemin.optipng( { optimizationLevel: 3 } ),
                    imageminPng( { speed: 5 } )
                ],
                {
                    verbose: true
                }
            )
        ) )
        .pipe( gulp.dest( paths.images.dist ) );
};

/**
 * Сборка Favicons
 */
tasks.faviconGenerate = function() {
    return gulp.src( paths.favicons.master )
        .pipe( plugins.favicons( {
            appName: null,                  // Your application's name. `string`
            appDescription: null,           // Your application's description. `string`
            developerName: null,            // Your (or your developer's) name. `string`
            developerURL: null,             // Your (or your developer's) URL. `string`
            background: '#fff',             // Background colour for flattened icons. `string`
            theme_color: '#fff',            // Theme color for browser chrome. `string`
            path: paths.favicons.path,       // Path for overriding default icons path `string`
            display: "standalone",          // Android display: "browser" or "standalone". `string`
            orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string`
            start_url: "/?homescreen=1",    // Android start application's URL. `string`
            version: 1.0,                   // Your application's version number. `number`
            logging: false,                 // Print logs to console? `boolean`
            online: false,                  // Use RealFaviconGenerator to create favicons? `boolean`
            preferOnline: false,            // Use offline generation, if online generation has failed. `boolean`
            html: paths.favicons.html,
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
        .pipe( plugins.if( '*.+(ico|png|svg|xml)', gulp.dest( paths.favicons.ready ) ) )
        .pipe( gulp.dest( paths.favicons.src ) );
};

/**
 * Отслеживание изменений
 */
tasks.watch = function( done ) {
    gulp.watch( paths.watch.html, gulp.series( tasks.html ) );
    gulp.watch( paths.watch.sass, gulp.series( tasks.cssMain ) );
    gulp.watch( paths.watch.sassVendor, gulp.series( tasks.cssVendor ) );
    gulp.watch( paths.watch.js, gulp.series( tasks.jsMain ) );
    gulp.watch( paths.watch.reload, bs.reload );

    done();
};

/**
 * Автоперезагрузка браузера
 */
tasks.liveReload = function() {
    bs.init( {
        server: {
            baseDir: paths.html.src
        },
        notify: false
    } );
};

/**
 * Установка переменной окружения NODE_ENV = 'development'
 */
tasks.setDevNodeEnv = function( done ) {
    process.env.NODE_ENV = 'development';
    done();
};

/**
 * Установка переменной окружения NODE_ENV = 'production'
 */
tasks.setProdNodeEnv = function( done ) {
    process.env.NODE_ENV = 'production';
    done();
};

module.exports = tasks;
