/*
 * @name: 文件
 * @Author: Haojin Sun
 * @Date: 2020-01-04 14:15:31
 * @LastEditors  : Haojin Sun
 * @LastEditTime : 2020-01-06 09:41:15
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
const useref = require('gulp-useref') //将html内的css js 分离出来 再以文件导入
const myScss = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const connect = require('gulp-connect')
var clean = require('gulp-clean');
const myTs = require("gulp-typescript")
const tsProject = myTs.createProject("tsconfig.json")
/**
 *  在html文件中 以 @@include('./footer.html') 这样的形式去引入相同文件
 */
const fileinclude = require('gulp-file-include')

const {app, targets} = require('./config')



function myClean() {
    return src('./build', {allowEmpty: true})
        .pipe(clean())
}

function html() {
    return src(`${app.srcPath}views/*.html`)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        })).on('error', function(err) {
            console.error('Task:copy-html,', err.message);
            this.end();
        })
        .pipe(dest(`${app.devPath}views`))
        .pipe(connect.reload())
}

function css() {
    return src(`${app.srcPath}css/**/*.css`)
        .pipe(dest(`${app.devPath}css/`))
        .pipe(connect.reload())
}

function scss() {
    return src(`${app.srcPath}css/**/*.scss`)
        .pipe(myScss())
        .pipe(dest(`${app.devPath}css/`))
        .pipe(connect.reload())
}

function js() {
    return src('./src/js/**/*.js')
        .pipe(dest(`${app.devPath}js/`))
        .pipe(connect.reload())
}

function ts() {
    return src('./src/ts/**/*.ts')
        .pipe(tsProject())
        .pipe(babel())
        .pipe(dest(`${app.devPath}js/`))
        .pipe(concat('tsmain.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(`${app.prdPath}js/`))
        .pipe(connect.reload())
}

function img() {
    return src('./src/img/**/*.{png,jpg,gif}')
        .pipe(dest(`${app.devPath}img/`))
        .pipe(connect.reload())
}
// 外部框架代码
function plugin() {
    return src('./src/plugin/**/*')
        .pipe(dest(`${app.devPath}plugin/`))
        .pipe(connect.reload())
}
module.exports = {myClean, js, css, scss, html, img, plugin};