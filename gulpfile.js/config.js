// css 兼容性
const targets = {
    ie: "9",
    firefox: "60",
    chrome: "53",
    safari: "11.1",
}

const app = {
    srcPath: 'src/', // 源代码目录
    devPath: 'build/', // 开发目录，整合之后的文件
    prdPath: 'dist/' // 生产上线目录，生产和部署
}
module.exports= {targets, app}