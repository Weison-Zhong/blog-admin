import axios from "axios";
import { message } from "antd";

const http = axios.create({
  baseURL: "",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

http.interceptors.request.use(
  (config) => {
    config.headers.Authorization = localStorage.getItem("WeisonToken");
    return config;
  },
  (err) => {
    console.log({ err });
  }
);

http.interceptors.response.use(
  (res) => {
    const { data } = res;
    const { code, msg } = data;
    if (code == 200) {
      return data;
    }
    message.error(msg);
  },
  (err) => {
    const { message: msg, response } = err;
    if (typeof response === "undefined") {
      console.log("接口报错 err--->", err);
      //超时会走这里，msg会是timeout of xxms exceeded
      message.error(msg);
      return err;
    }
    //服务器有响应，但返回状态码非2开头
    const { status, data, statusText } = err.response;
    console.log("接口报错 err.response.data--->", data);
    switch (status) {
      case 400:
        message.error(data.msg);
        break;
      case 401:
        message.error("请先登录！");
        // window.location.href = '/login';
        break;
      case 403:
        message.error("权限不足！");
        break;
      case 404:
        message.error("接口报 404 资源Not Found！");
        break;
      case 422:
        message.error("接口报 422 错误请求，请查看控制台");
        break;
      case 405:
        message.error("接口报 405 请求方法不被允许");
        break;
      default:
        message.error(statusText);
        message.error(data);
        break;
    }
    return data;
  }
);

export default http;
