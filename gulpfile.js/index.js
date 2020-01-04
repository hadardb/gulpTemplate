/*
 * @name: 文件
 * @Author: Haojin Sun
 * @Date: 2019-12-05 17:14:18
 * @LastEditors  : Haojin Sun
 * @LastEditTime : 2020-01-04 15:45:24
 */
const {
    series,
    src,
    dest,
    watch,
    parallel
} = require('gulp')
const connect = require('gulp-connect')
const proxy = require('http-proxy-middleware')

// 根据环境引入不同的配置文件
if (process.env.NODE_ENV === 'dev') {
    var {
        myClean,
        js,
        css,
        scss,
        html,
        img,
        plugin
    } = require('./gulp.dev');

} else {
    var {
        myClean,
        js,
        css,
        scss,
        html,
        img,
        plugin
    } = require('./gulp.prd');
}

function server() {
    connect.server({
        livereload: true,
        port: 8888,
        root: process.env.NODE_ENV === 'dev'? 'build' : 'dist',
        livereload: true, //自动更新
        // 请求代理
        middleware: function (connect, opt) {
            return [
                proxy('/api', {
                    target: 'http://localhost:8080',
                    changeOrigin: true
                }),
                proxy('/otherServer', {
                    target: 'http://IP:Port',
                    changeOrigin: true
                })
            ]
        }
    })
}
watch('./src/css/**/*.css', css);
watch('./src/css/**/*.scss', scss);
watch('./src/img/**/*.{png,jpg,gif}', img);
watch('./src/js/**/*.js', js);
watch('./src/**/*.html', html);
watch('./src/plugin', plugin);

exports.default = series(myClean, img,html, js, css, scss, plugin, server);