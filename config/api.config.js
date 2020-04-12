const isPro = Object.is(process.env.NODE_ENV, 'production')
/**配置解释
 *
 *（1）当开发环境下，会出现跨域问题
 * 利用axios的baseUrl直接默认值是 api，每次访问的时候，自动补上这个api前缀，
 * 就不需要自己手工在每个接口上面写这个前缀了
 *（2）当为生产环境时 即部署到线上
 * 因为直接将vue前端项目打包后集成到springBoot项目中，此时在同一个接口下工作，
 * 不存在跨域问题，因此也不需要写成http://localhost:8080/api/，而直接为http://localhost:8080/，不会匹配到index.js中配置的代理
 * 因此baseUrl直接为 { IP:端口号 }即可*/
module.exports = {
    baseUrl: isPro ? 'http://localhost:8080/' : 'api/'
}