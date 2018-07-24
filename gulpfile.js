'use strict';

const
    gulp = require( 'gulp' ),
    tasks = require( './gulp/tasks' );

/*****************************
 Display name
 ******************************/

tasks.cleanDist.displayName = 'clean dist';
tasks.cleanFavicons.displayName = 'clean favicons';
tasks.cleanCache.displayName = 'clean cache';
tasks.cleanSprite.displayName = 'clean sprite';
tasks.html.displayName = 'build html';
tasks.fonts.displayName = 'build fonts';
tasks.cssMain.displayName = 'build main css';
tasks.cssVendor.displayName = 'build vendor css';
tasks.jsMain.displayName = 'build main js';
tasks.jsVendor.displayName = 'build vendor js';
tasks.images.displayName = 'build images';
tasks.faviconGenerate.displayName = 'favicons generate';
tasks.sprite.displayName = 'sprite generate';
tasks.spriteCopy.displayName = 'sprite copy to images';
tasks.watch.displayName = 'watch';
tasks.liveReload.displayName = 'reload';
tasks.setDevNodeEnv.displayName = 'set node_env - development';
tasks.setProdNodeEnv.displayName = 'set node_env - production';

/*****************************
 Tasks
 *****************************/

gulp.task( 'clean:dist', tasks.cleanDist );
gulp.task( 'clean:cache', tasks.cleanCache );
gulp.task( 'clean:favicons', tasks.cleanFavicons );
gulp.task( 'clean:sprite', tasks.cleanSprite );

gulp.task( 'html', tasks.html );
gulp.task( 'fonts', tasks.fonts );
gulp.task( 'css:main', tasks.cssMain );
gulp.task( 'css:vendor', tasks.cssVendor );
gulp.task( 'js:main', tasks.jsMain );
gulp.task( 'js:vendor', tasks.jsVendor );
gulp.task( 'images', tasks.images );
gulp.task( 'favicons', gulp.series( tasks.cleanFavicons, tasks.faviconGenerate ) );
gulp.task( 'sprite', gulp.series( tasks.cleanSprite, tasks.sprite ) );
gulp.task( 'sprite:copy', tasks.spriteCopy );
gulp.task( 'live-reload', gulp.parallel( tasks.watch, tasks.liveReload ) );

gulp.task( 'set-dev-node-env', tasks.setDevNodeEnv );
gulp.task( 'set-prod-node-env', tasks.setProdNodeEnv );

gulp.task( 'build',
    gulp.series(
        gulp.series( tasks.setDevNodeEnv ),
        gulp.parallel(
            tasks.html,
            tasks.fonts,
            tasks.cssMain,
            tasks.cssVendor,
            tasks.jsMain,
            tasks.jsVendor
        ),
        gulp.parallel( tasks.watch, tasks.liveReload )
    )
);

gulp.task( 'prod',
    gulp.series(
        gulp.series( tasks.setProdNodeEnv, tasks.cleanDist ),
        gulp.parallel(
            tasks.html,
            tasks.fonts,
            tasks.cssMain,
            tasks.cssVendor,
            tasks.jsMain,
            tasks.jsVendor,
            tasks.images
        )
    )
);
