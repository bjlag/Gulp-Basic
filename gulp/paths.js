'use strict';

const paths = {
    dist: './dist',
    src: './src',

    html: {
        src: './src/assets',
        dist: './dist',
        ready: './src/assets/*.html',
        tmpl: './src/html/pages/*.html'
    },

    fonts: {
        ready: './src/assets/fonts/**/*',
        dist: './dist/fonts',
        src: './src/assets/fonts',
        vendor: [
            './node_modules/@fortawesome/fontawesome-free/webfonts/**/*'
        ]
    },

    css: {
        sass: './src/sass/main.sass',
        dist: './dist/css',
        src: './src/assets/css',
        vendor: [
            './src/sass_vendor/**/*'
        ]
    },

    js: {
        code: [
            './src/js/_glob_vars.js',
            './src/js/**/*.js',
            './src/js/_main.js'
        ],
        dist: './dist/js',
        src: './src/assets/js',
        vendor: [
            './node_modules/jquery/dist/jquery.slim.js',
            './node_modules/popper.js/dist/umd/popper.js',
            './node_modules/bootstrap/dist/js/bootstrap.js'
        ]
    },

    images: {
        src: './src/assets/images/**/*',
        dist: './dist/images'
    },

    favicons: {
        ready: './src/assets/images/favicons',
        master: './src/favicons/favicon-master.png',
        src: './src/favicons/icons',
        html: '../../html/includes/favicons.html',
        path: 'images/favicons'
    },

    watch: {
        html: './src/html/**/*.html',
        sass: './src/sass/**/*.+(sass|scss)',
        sassVendor: './src/sass_vendor/**/*.+(sass|scss)',
        js: './src/js/**/*.js',
        reload: './src/assets/*.html'
    }
};

module.exports = paths;
