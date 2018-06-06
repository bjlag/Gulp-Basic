'use strict';

var app = {};

app.init = function() {
    console.log( 'in main.js' );
};

;( function ( obj ) {
    var gotoTop = {};

    gotoTop.init = function( options ) {
        var scrollSize = options.scrollSize,
            $button = $( options.buttonId ),
            classShow = options.classShow;

        $( window ).on( 'scroll', function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if ( scrollTop > scrollSize ) {
                $button.addClass( classShow )
            } else {
                $button.removeClass( classShow );
            }
        } );

        // кнопка наверх
        $button.on( 'click', function () {
            $( 'body, html' ).animate( {
                scrollTop: 0
            }, 400 );
            return false;
        } );
    };

    obj.gotoTop = gotoTop;
} )( app );
$( function () {
    app.init();
    app.gotoTop.init( {
        buttonId: '#goto-top',
        classShow: 'goto-top--show',
        scrollSize: 200
    } );
} );