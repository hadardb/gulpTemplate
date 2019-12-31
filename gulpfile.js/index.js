/*
 * @Author: Haojin Sun
 * @Date: 2019-12-05 17:14:18
 * @LastEditors: Haojin Sun
 * @LastEditTime: 2019-12-16 16:48:58
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

const app = {
    srcPath: 'src/', // 源代码目录
    devPath: 'build/', // 开发目录，整合之后的文件
    prdPath: 'dist/' // 生产上线目录，生产和部署
}
// css 兼容性
const targets = {
    ie: "9",
    firefox: "60",
    chrome: "53",
    safari: "11.1",
}

function server() {
    connect.server({
        livereload: true,
        port: 8888,
        root: 'build'
    })
}

function cleanBuild() {
    return src('./build')
        .pipe(clean())
}

function cleaDist() {
    return src('./dist')
        .pipe(clean())
}

function html() {
    return src(`${app.srcPath}**/*.html`)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest(app.devPath))
        .pipe(dest(app.prdPath))
        .pipe(connect.reload())
}

function css() {
    return src(`${app.srcPath}css/**/*.css`)
        .pipe(dest(`${app.devPath}css/`))
        .pipe(autoprefixer(targets))
        .pipe(cssmin())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest(`${app.prdPath}css/`))
        .pipe(connect.reload())
}

function scss() {
    return src(`${app.srcPath}css/**/*.scss`)
        .pipe(myScss())
        .pipe(autoprefixer(targets))
        .pipe(dest(`${app.devPath}css/`))
        // .pipe(rename({
        //     extname: '.min.css'
        // }))
        .pipe(cssver())
        .pipe(cssmin())
        .pipe(dest(`${app.prdPath}css/`))
        .pipe(connect.reload())
}

function js() {
    return src('./src/js/**/*.js')
        .pipe(dest(`${app.devPath}js/`))
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(`${app.prdPath}js/`))
        .pipe(connect.reload())
}

function ts() {
    return src('./src/ts/**/*.ts')
        .pipe(tsProject())
        .pipe(babel())
        .js.pipe(dest(`${app.devPath}js/`))
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
        // .pipe(imagemin())
        .pipe(dest(`${app.prdPath}img/`))
        .pipe(connect.reload())
}

function plugin() {
    return src('./src/plugin/**/*')
        .pipe(dest(`${app.devPath}plugin/`))
        .pipe(dest(`${app.prdPath}plugin/`))
        .pipe(connect.reload())
}

watch('./src/css/**/*.css', css);
watch('./src/css/**/*.scss', scss);
watch('./src/img/**/*.{png,jpg,gif}', img);
watch('./src/js/**/*.js', js);
watch('./src/js/**/*.ts', ts);
watch('./src/**/*.html', html);
watch('./src/plugin', plugin);
// exports.default = series(cleanBuild, cleaDist, scss, ts, html, img, plugin, server);
exports.default = series(cleanBuild, cleaDist, js, css, scss, ts, html, img, plugin, server);