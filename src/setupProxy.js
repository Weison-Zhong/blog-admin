const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      // target: "http://127.0.0.1:5000",
      // target: "http://192.168.0.116:5000", //联想笔记本win环境
      target: "http://www.weison-zhong.cn:5001", //腾讯云测试环境开放接口
      changeOrigin: true,
    })
  );
};


// const { createProxyMiddleware } = require('http-proxy-middleware');
// module.exports = function (app) {
//     app.use(
//         '/api',
//         createProxyMiddleware({
//             target: 'https://eyesight.news.qq.com/',
//             changeOrigin: true,
//             pathRewrite: {
//                 '^/api': '',
//             }
//         })
//     );
//     app.use(
//         '/apc',
//         createProxyMiddleware({
//             target: 'https://api.inews.qq.com/',
//             changeOrigin: true,
//             pathRewrite: {
//                 '^/apc': '',
//             }
//         })
//     );
// };
 