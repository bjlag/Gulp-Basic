'use strict';

var app = {};

$( function () {
    console.log( 'in main.js' );

    app.gotoTop.init( {
        buttonId: '#goto-top',
        classShow: 'goto-top--show',
        scrollSize: 200
    } );
} );
