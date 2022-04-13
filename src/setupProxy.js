const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      // target: "http://127.0.0.1:5001",
      // target: "http://192.168.0.116:5000", //联想笔记本win环境
      target: "http://www.weison-zhong.cn:5001", //腾讯云测试环境开放接口
      // target: "http://www.weison-zhong.cn:5000", //腾讯云生产环境接口
      changeOrigin: true,
    })
  );
};
