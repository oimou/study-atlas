module.exports = {
    chainWebpack: config => {
        config
        .plugin('html')
        .tap(args => {
            args[0].title = '定理マップ（自分用）'
            return args
        })
    },
    publicPath: process.env.NODE_ENV === 'production'
        ? '/study-atlas/'
        : '/'
}