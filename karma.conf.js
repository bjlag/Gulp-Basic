module.exports = function ( config ) {
    config.set( {
        basePath: '',
        frameworks: [ 'mocha', 'browserify' ],
        files: [
            'src/assets/js/vendor.min.js',
            'src/js/**/*.js',
            'tests/frontend/**/*.test.js'
        ],
        exclude: [],
        preprocessors: {
            'src/js/**/*.js': [ 'coverage' ],
            'tests/frontend/*.js': [ 'browserify' ]
        },

        port: 9876,
        colors: true,

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [ 'progress', 'coverage' ],

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [ 'Chrome' ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    } )
};
