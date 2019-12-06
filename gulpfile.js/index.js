/*
 * @Author: Haojin Sun
 * @Date: 2019-12-05 17:14:18
 * @LastEditors: Haojin Sun
 * @LastEditTime: 2019-12-06 15:15:35
 */
const {
    series,
    src,
    dest,
    watch
} = require('gulp')
const cssmin = require('gulp-clean-css')
const cssver = require('gulp-make-css-url-version')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const useref = require('gulp-useref')   //将html内的css js 分离出来 再以文件导入
const myScss = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const connect = require('gulp-connect')
/**
 *  在html文件中 以 @@include('./footer.html') 这样的形式去引入相同文件
 */
const fileinclude = require('gulp-file-include')

function server(){
    connect.server({
        livereload: true,
        port:8888,
        root:'build'
    })
}

function html() {
    return src('./src/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('./build/'))
        .pipe(connect.reload())
}

function css() {
    return src('./src/css/*.css')
        .pipe(cssmin())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest('./build/css/'))
        .pipe(connect.reload())
}

function scss() {
    return src('./src/css/*.scss')
        .pipe(myScss())
        .pipe(autoprefixer({
            ie: "9",
            firefox: "60",
            chrome: "53",
            safari: "11.1",
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(cssver())
        .pipe(cssmin())

        .pipe(dest('./build/css/'))
        .pipe(connect.reload())
}

function js() {
    return src('./src/js/*.js')
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('./build/js/'))
        .pipe(connect.reload())
}

function img() {
    return src('./src/img/*.{png,jpg,gif}')
        .pipe(imagemin())
        .pipe(dest('./build/img'))
        .pipe(connect.reload())
}
watch('./src/css/*.css', css);
watch('./src/css/*.scss', scss);
watch('./src/img/*.{png,jpg,gif}', img);
watch('./src/js/*.js', js);
watch('./src/*.html', html);
exports.html = html;
exports.img = img;
exports.scss = scss;
exports.css = css;
exports.js = js;
exports.default = series(html, scss,css, js,server);