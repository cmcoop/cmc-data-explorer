/// <reference path="Scripts/leafletExtension/Leaflet.SlideMenu-master/src/L.Control.SlideMenu.js" />
/// <reference path="Scripts/leafletExtension/leaflet-zoom-min-master/L.Control.ZoomMin.js" />
/// <reference path="C:\Users\parrishd\Documents\sourcetreeProjects\cmc2\Scripts/ui-leafletCMC.js" />
/// <reference path="bower_components/ng-file-upload/ng-file-upload-all.min.js" />
/// <reference path="bower_components/ng-file-upload/ng-file-upload-all.min.js" />
/// <reference path="bower_components/moment-picker/dist/angular-moment-picker.js" />
/// <reference path="bower_components/ui-leaflet/dist/ui-leaflet.js" />
/// <reference path="bower_components/toastr/toastr.js" />
/// <reference path="bower_components/jquery-validate/dist/jquery.validate.min.js" />
/// <reference path="bower_components/jquery-validate/dist/jquery.validate.min.js" />
/// <binding />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/
var gulp = require('gulp');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var print = require('gulp-print');
var uglify = require('gulp-uglify');
var debug = require('gulp-debug');
var mainBowerFiles = require('main-bower-files');
var sourcemaps = require('gulp-sourcemaps');

    //Modernizr
var modernizrsrc = ['bower_components/modernizr/modernizr.js'];
var modernizrbundle = 'Scripts/modernizer.min.js';



var jsPaths =
    [
        'bower_components/jquery/dist/jquery.js',        
        'bower_components/jquery.validation/dist/jquery.validate.js',
        'bower_components/Microsoft.jQuery.Unobtrusive.Validation/jquery.validate.unobtrusive.js',        
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/respond/src/respond.js',      
        'bower_components/angular/angular.js',
        'bower_components/bootstrap-select/dist/js/bootstrap-select.js',
        'bower_components/toastr/toastr.min.js',
        'Scripts/toastrOptions/toastrOptions.js',
        'bower_components/leaflet/dist/leaflet.js',
        'bower_components/angular-simple-logger/dist/angular-simple-logger.js',
        'Scripts/ui-leafletCMC.js',
        
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',        
        //'bower_components/angular-route/angular-route.js',
        'bower_components/angular-messages/angular-messages.js',
        'bower_components/angular-http-batcher/dist/angular-http-batch.js',
        'bower_components/angular-utils-pagination/dirPagination.js',
        'bower_components/angular-ui-grid/ui-grid.js',
        'Scripts/ng-csv.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        
        'bower_components/moment/min/moment-with-locales.js',
        'node_modules/chart.js/dist/Chart.js',
        'node_modules/angular-chart.js/dist/angular-chart.js',
        
        'bower_components/olingo-odatajs/odatajs.js',
        
        'bower_components/moment-picker/dist/angular-moment-picker.js',
        'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
        'bower_components/ng-file-upload/ng-file-upload-all.min.js',
        'bower_components/d3/d3.js',
        'bower_components/nvd3/build/nv.d3.js',
        'bower_components/angular-nvd3/dist/angular-nvd3.js',
        'bower_components/d3-to-image/lib/d3-to-image-ngDirective.js',
        'bower_components/angular-file-saver/dist/angular-file-saver.bundle.js',
        'Scripts/leafletExtension/leaflet.zoomhome-master/dist/leaflet.zoomhome.js',
        'Scripts/bootstrapExtension/ui-bootstrap-custom-tpls-0.12.0.js',
        'node_modules/save-svg-as-png/lib/saveSvgAsPng.js'
    ];
    var uglyOptions = {
        mangle: false
    };

    gulp.task('packJs', function () {
        return gulp.src(jsPaths)
    //return gulp.src(mainBowerFiles({
        // Only the JavaScript files
    //    filter: '**/*.js'
    //}), { base: 'bower_components' })
        .pipe(debug())
      
      //.pipe(babel({ presets: ['es2015'] }))
      .pipe(concat('allJsLibraries.js'))
      
      .pipe(gulp.dest('Scripts'));
    });

    var cssPaths =
        [          
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'Content/customCss/cmcBootstrapTheme.css',
        'bower_components/leaflet/dist/leaflet.css',
        
        //'bower_components/bootstrap/dist/css/bootstrap-theme.css',
        'bower_components/bootstrap-select/dist/css/bootstrap-select.css.map',
        'bower_components/bootstrap-select/dist/css/bootstrap-select.css',
        'bower_components/angular-ui-grid/ui-grid.css',

        'bower_components/moment-picker/dist/angular-moment-picker.css',
        'bower_components/toastr/toastr.css',
        'bower_components/nvd3/build/nv.d3.css',
        'Scripts/leafletExtension/leaflet.zoomhome-master/dist/leaflet.zoomhome.css'
    ]
// concatenate all css files to single file
gulp.task('packCss', function () {
    return gulp.src(cssPaths)
        //mainBowerFiles({
        // Only the CSS files
        //filter: /.*\.css$/i
   // }), { base: 'bower_components' })
      .pipe(debug())
      .pipe(concat('allStyles.css'))
      .pipe(gulp.dest('Content'));
});

// Move font-awesome fonts folder to css compiled folder
gulp.task('icons', function () {
    return gulp.src('bower_components/font-awesome/**/**.*')
        .pipe(gulp.dest('Content/fonts'));
});

//Create a modernizr bundled file
gulp.task('modernizer', function () {
    return gulp.src(modernizrsrc)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('modernizer-min.js'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('Scripts'));
});


gulp.task('packAll', ['packJs', 'packCss', 'modernizer']);

