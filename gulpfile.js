'use strict';

//-----------------------------------------------------
// Подключение плагинов
//-----------------------------------------------------

const
    // Подключаем Gulp.
    gulp = require( 'gulp' ),
    // В случае ошибки работа Gulp не прирывается. Выводится информация об ошибке.
    plumber = require( 'gulp-plumber' ),
    // Удаление файлов
    del = require( 'del' ),
    // Переименовывание файлов
    rename = require( 'gulp-rename' ),
    // Препроцессор SASS
    sass = require( 'gulp-sass' ),
    // Нужен для корректной обработки @import вида './**/*'
    sassGlob = require( 'gulp-sass-glob' ),
    // Объединение файлов
    concat = require( 'gulp-concat' ),
    // Добавление вендорных префиксов в CSS
    autoprefixer = require( 'gulp-autoprefixer' ),
    // Постороение Sourcemaps
    sourcemaps = require( 'gulp-sourcemaps' ),
    // Подключение файлов
    fileinclude = require( 'gulp-file-include' ),
    // Генерация Favicons
    favicons = require( 'gulp-favicons' ),
    // Группировка медиа запросов CSS
    gcmq = require( 'gulp-group-css-media-queries' ),
    // Автоперезагрузка страницы в браузере при изменениях отслеживаемых файлов
    bs = require( 'browser-sync' ).create(),
    // Мониторинг изменений
    watch = require( 'gulp-watch' ),
    // Для запуска плагинов при определенных условиях приямо в потоке
    gulpif = require( 'gulp-if' ),
    // Форматирование HTML файлов
    htmlbeautify = require( 'gulp-html-beautify' ),
    // Оптимизация CSS
    cleanCss = require( 'gulp-clean-css' ),
    // Оптимизация JS
    uglify = require( 'gulp-uglify' ),
    // Оптимизация изображений
    imagemin = require( 'gulp-imagemin' ),
    imageminJpeg = require( 'imagemin-jpeg-recompress' ),
    imageminPng = require( 'imagemin-pngquant' ),
    // Работа с кешем
    cache = require( 'gulp-cache' ),
    // Получение параметров из командной строки
    argv = require( 'yargs' ).argv;


//-----------------------------------------------------
// Настройки проекта
//-----------------------------------------------------

const
    path = {
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
            vendor: [
                './src/vendor/bootstrap/dist/fonts/**/*',
                './src/vendor/font-awesome/fonts/**/*'
            ]
        },
        css: {
            sass: './src/blocks/main.sass',
            dist: './dist/assets/css',
            src: './src/assets/css',
            vendor: [
                './src/vendor/normalize-css/normalize.css',
                './src/vendor/bootstrap/dist/css/bootstrap.css',
                './src/vendor/font-awesome/css/font-awesome.css'
            ]
        },
        js: {
            code: './src/blocks/**/*.js',
            dist: './dist/assets/js',
            src: './src/assets/js',
            vendor: [
                './src/vendor/jquery/dist/jquery.js',
                './src/vendor/bootstrap/dist/js/bootstrap.min.js'
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
// Задачи проекта
//-----------------------------------------------------

/**
 * Очистить папку dist
 */
gulp.task( 'clean:dist', () => {
    return del( path.root.dist );
} );

/**
 * Очистить кеш
 */
gulp.task( 'clean:cache', ( done ) => {
    return cache.clearAll( done );
} );

/**
 * Удаление Favicons
 */
gulp.task( 'clean:favicon', () => {
    return del( [ path.favicons.src, path.favicons.ready ] );
} );

/**
 * Сборка HTML
 */
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

/**
 * Копирование шрифтов
 */
gulp.task( 'fonts', () => {
    let isProduction = argv.prod,
        srcPath = path.fonts.ready,
        distPath = (isProduction ? path.fonts.dist : path.fonts.src);

    if ( !isProduction ) {
        srcPath = path.fonts.vendor;
    }

    return gulp.src( srcPath )
        .pipe( plumber() )
        .pipe( gulp.dest( distPath ) );
} );

/**
 * Сборка основных CSS
 */
gulp.task( 'css:main', () => {
    let isProduction = argv.prod,
        distPath = (isProduction ? path.css.dist : path.css.src);

    return gulp.src( path.css.sass )
        .pipe( plumber() )
        .pipe( gulpif( !isProduction, sourcemaps.init() ) )
        .pipe( sassGlob( {
                ignorePaths: [
                    '_*.+(sass|scss)' // исключить из обработки базовые импорты
                ]
            } )
        )
        .pipe( sass() )
        .pipe( concat( 'main.css' ) )
        .pipe( gcmq() )
        .pipe( autoprefixer( { browsers: [ 'last 15 versions', '> 0.1%' ] } ) )
        .pipe( gulp.dest( distPath ) )

        .pipe( cleanCss( {
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
        .pipe( rename( { suffix: '.min' } ) )
        .pipe( gulpif( !isProduction, sourcemaps.write( '.' ) ) )
        .pipe( gulp.dest( distPath ) )

        .pipe( bs.stream() );
} );

/**
 * Сборка вендорных CSS
 */
gulp.task( 'css:vendor', () => {
    let isProduction = argv.prod,
        distPath = (isProduction ? path.css.dist : path.css.src),
        vendor = path.css.vendor;

    return gulp.src( vendor )
        .pipe( plumber() )
        .pipe( gulpif( !isProduction, sourcemaps.init() ) )
        .pipe( concat( 'vendor.css' ) )
        .pipe( gulp.dest( distPath ) )

        .pipe( rename( { suffix: '.min' } ) )
        .pipe( cleanCss( {
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
        .pipe( gulpif( !isProduction, sourcemaps.write( '.' ) ) )
        .pipe( gulp.dest( distPath ) )

        .pipe( bs.stream() );
} );

/**
 * Сборка основного JS
 */
gulp.task( 'js:main', () => {
    let isProduction = argv.prod,
        distPath = (isProduction ? path.js.dist : path.js.src);

    return gulp.src( path.js.code )
        .pipe( plumber() )
        .pipe( gulpif( !isProduction, sourcemaps.init() ) )
        .pipe( concat( 'main.js' ) )
        .pipe( gulp.dest( distPath ) )

        .pipe( rename( { suffix: '.min' } ) )
        .pipe( uglify() )
        .pipe( gulpif( !isProduction, sourcemaps.write( '.' ) ) )
        .pipe( gulp.dest( distPath ) )

        .pipe( bs.stream() );
} );

/**
 * Сборка вендорных JS
 */
gulp.task( 'js:vendor', () => {
    let isProduction = argv.prod,
        distPath = (isProduction ? path.js.dist : path.js.src),
        vendor = path.js.vendor;

    return gulp.src( vendor )
        .pipe( plumber() )
        .pipe( gulpif( !isProduction, sourcemaps.init() ) )
        .pipe( concat( 'vendor.js' ) )
        .pipe( gulp.dest( distPath ) )

        .pipe( rename( { suffix: '.min' } ) )
        .pipe( uglify() )
        .pipe( gulpif( !isProduction, sourcemaps.write( '.' ) ) )
        .pipe( gulp.dest( distPath ) );
} );

/**
 * Оптимизация изображений
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
 * Сборка Favicons
 */
gulp.task( 'favicon:generate', [ 'clean:favicon' ], () => {
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
 * Запуск автоперезагрузки браузера и отслеживания изменений файлов
 */
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
 * Сборка проекта
 * gulp build --prod (продакшен)
 * gulp build (разработка)
 */
gulp.task( 'build', [ 'html', 'fonts', 'css:main', 'css:vendor', 'js:main', 'js:vendor', ], () => {
    if ( argv.prod ) {
        gulp.start( 'images' );
    } else {
        gulp.start( 'browser-sync' );
    }
} );