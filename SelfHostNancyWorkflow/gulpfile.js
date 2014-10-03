var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    autoprefixer = require('gulp-autoprefixer'),
    ngAnnotate = require("gulp-ng-annotate"),
    minifyCss = require("gulp-minify-css"),
    plumber = require("gulp-plumber"),
    gulpif = require("gulp-if"),
    uglify = require("gulp-uglify"),
    args = require('yargs').argv;

// Modules for webserver and livereload
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    httpProxy = require('http-proxy'),
    livereloadport = 35729,
    serverport = 5000;

var dev = args.build !== 'production';

// Set up a proxy server to use
var devProxy = httpProxy.createProxyServer();

var server = express();
// Add live reload
server.use(livereload({ port: livereloadport }));

server.use(express.static('./'));

server.all('/*', function (req, res) {
    //res.sendFile("./views/index.html");
    // Send nancy application through a proxy
    devProxy.web(req, res, { target: "http://localhost:1234" });
});

// Dev task
gulp.task('dev', ['clean', 'views', 'styles', 'lint', 'browserify']);

// Clean task
gulp.task('clean', function () {
    gulp.src('./content/templates', { read: false }) // much faster
        .pipe(rimraf({ force: true }));
});

// JSHint task
gulp.task('lint', function () {
    gulp.src('app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Styles task
gulp.task('styles', function () {
    gulp.src(["./bower_components/bootstrap/dist/css/bootstrap.css",
        "./bower_components/angular-ui-select/dist/select.css",
        "./bower_components/c3/c3.css",
        "./app/css/style.css"
    ])
        .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
        .pipe(minifyCss({ keepBreaks: true }))
        .pipe(concat("styles.css"))
        .pipe(gulp.dest('content/css/'));

    gulp.src(["./bower_components/bootstrap/dist/fonts/*"])
        .pipe(gulp.dest("content/fonts/"));
});

// Browserify task
gulp.task('browserify', function () {
    // Single point of entry (make sure not to src ALL your files, browserify will figure it out)
    gulp.src(['app/app.js'])
        .pipe(plumber())
        .pipe(browserify({
            insertGlobals: true,
            debug: dev,
            shim: {
                'angular': {
                    path: './bower_components/angular/angular.js',
                    exports: 'angular'
                },
                'angular-bootstrap': {
                    path: './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                    exports: 'null',
                    depends: {
                        angular: 'angular'
                    }
                },
                'angular-route': {
                    path: './bower_components/angular-route/angular-route.js',
                    exports: 'ngRoute',
                    depends: {
                        angular: 'angular'
                    }
                }
            }
        }))
        .pipe(gulpif(!dev, ngAnnotate()))
        // Bundle to a single file
        .pipe(concat('bundle.js'))
        // Output it to our dist folder
        .pipe(gulpif(!dev, uglify()))
        .pipe(gulp.dest('content/js'));
});

// Views task
gulp.task('views', function () {
    // Get our index.html
    gulp.src('index.html')
        // And put it in the dist folder
        .pipe(gulp.dest('content/'));

    // Any other view files from app/views
    gulp.src('app/templates/**/*')
        // Will be put in the dist/views folder
        .pipe(gulp.dest('content/templates/'));
});

gulp.task('watch', ['lint'], function () {

    // Start webserver
    server.listen(serverport);
    // Start live reload
    refresh.listen(livereloadport);

    // Watch our scripts, and when they change run lint and browserify
    gulp.watch(['app/app.js', 'app/**/*.js'], [
        'lint',
        'browserify'
    ]);
    // Watch our sass files
    gulp.watch(['./app/css/*.css'], [
        'styles'
    ]);

    gulp.watch(['app/**/*.html', 'views/index.html'], [
        'views'
    ]);

    gulp.watch('./app/**').on('change', refresh.changed);

});

gulp.task('default', ['dev', 'watch']);