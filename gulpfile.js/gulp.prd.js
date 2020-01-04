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
const Imagemin = require('gulp-imagemin')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const useref = require('gulp-useref') //将html内的css js 分离出来 再以文件导入
const myScss = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const connect = require('gulp-connect')
const Pngquant = require('imagemin-pngquant'); //png图片压缩插件
const clean = require('gulp-clean');
const Cache = require('gulp-cache'); // 进行图片缓存
const myTs = require("gulp-typescript")
const tsProject = myTs.createProject("tsconfig.json")
/**
 *  在html文件中 以 @@include('./footer.html') 这样的形式去引入相同文件
 */
const fileinclude = require('gulp-file-include')

const {
    app,
    targets
} = require('./config')

function myClean() {
    return src('./dist', {
            allowEmpty: true
        })
        .pipe(clean())
}

function html() {
    return src(`${app.srcPath}page/*.html`)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        })).on('error', function(err) {
            console.error('Task:copy-html,', err.message);
            this.end();
        })
        .pipe(dest(app.prdPath))
        .pipe(connect.reload())
}

function css() {
    return src(`${app.srcPath}css/**/*.css`)
        .pipe(autoprefixer(targets))
        .pipe(cssmin())
        .pipe(dest(`${app.prdPath}css/`))
        .pipe(connect.reload())
}

function scss() {
    return src(`${app.srcPath}css/**/*.scss`)
        .pipe(myScss())
        .pipe(autoprefixer(targets))
        .pipe(cssver())
        .pipe(cssmin())
        // .pipe(rename({
        //     extname: '.min.css'
        // }))
        .pipe(dest(`${app.prdPath}css/`))
        .pipe(connect.reload())
}

function js() {
    return src('./src/js/**/*.js')
        .pipe(babel())
        // .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest(`${app.prdPath}js/`))
        .pipe(connect.reload())
}

function ts() {
    return src('./src/ts/**/*.ts')
        .pipe(tsProject())
        .pipe(babel())
        .pipe(dest(`${app.devPath}js/`))
        .pipe(concat('tsmain.js'))
        .pipe(uglify())
        .pipe(dest(`${app.prdPath}js/`))
        .pipe(connect.reload())
}

function img() {
    return src('./src/img/**/*.{jpg,png,gif}')
        .pipe(Cache(Imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{
                removeViewBox: false
            }], //不要移除svg的viewbox属性
            use: [Pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(dest(`${app.prdPath}img/`))
        .pipe(connect.reload())
}

function plugin() {
    return src('./src/plugin/**/*')
        .pipe(dest(`${app.prdPath}plugin/`))
        .pipe(connect.reload())
}

module.exports = {
    myClean,
    js,
    css,
    scss,
    html,
    img,
    plugin
};