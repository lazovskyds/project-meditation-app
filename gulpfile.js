const { src, dest, watch, parallel, series } = require('gulp');

const scss              = require('gulp-sass'),
      concat            = require('gulp-concat'),
      browserSync       = require('browser-sync').create(),
      uglify            = require('gulp-uglify-es').default,
      autoPrefixer      = require('gulp-autoprefixer'),
      imagemin          = require('gulp-imagemin'),
      del               = require('del');

function styles() {
    return src([
        'src/scss/style.scss',
        'src/scss/responsive.scss'
    ])
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 10 version']
        }))
        .pipe(dest('src/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src('src/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js'))
        .pipe(browserSync.stream());
}

function startBrowserSync() {
    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });
}

function cleanBuild() {
    return del('build');
}

function build() {
    return src([
        'src/css/style.min.css',
        'src/audios/*.mp3',
        'src/js/main.min.js',
        'src/*.html'
    ], {base: 'src'})
        .pipe(dest('build'));
}

function images() {
    return src('src/images/**/*')
        .pipe(imagemin(
            [
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ]
        ))
        .pipe(dest('build/images'));
}

function watching() {
    watch(['src/scss/**/*.scss'], styles);
    watch(['src/js/**/*.js', '!src/js/main.min.js'], scripts);
    watch(['src/*.html']).on('change', browserSync.reload);
}


exports.styles              = styles;
exports.watching            = watching;
exports.startBrowserSync    = startBrowserSync;
exports.scripts             = scripts;
exports.cleanBuild          = cleanBuild;

exports.build               = series(cleanBuild, images, build);

exports.default             = parallel(styles, scripts, startBrowserSync, watching);