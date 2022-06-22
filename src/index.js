import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.less";
// import "antd/dist/antd.min.css"; //cdn引入
import zhCN from "antd/lib/locale/zh_CN";
import { Router, Switch, Route } from "react-router-dom";
import HISTORY from "./router";
import Login from "./pages/login";
import PageLayout from "./layout";
import { ConfigProvider } from "antd";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./redux";
import PrivateRoute from "./router/PrivateRoute";
import { getBlogConfigApi, guestConfigApi } from "@/axios/api";
import { loadCSS } from "@/utils/tools";
const store = createStore(rootReducer);
const fetchBlogConfig = async () => {
  const res = await getBlogConfigApi();
  const { data, code } = res;
  if (code !== 200) return;
  const { iconLink } = data || {};
  iconLink && loadCSS(iconLink); //请求接口获取iconfont链接并引入
};
function App() {
  useEffect(() => {
    fetchBlogConfig();
    //因为8081开放版本没有对应博客主页，故在此触发用于统计访客数据
    if (window.location.port === "8081") {
      guestConfigApi();
    }
  }, []);
  return (
    <ConfigProvider locale={zhCN}>
      <Router history={HISTORY}>
        <Provider store={store}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute path="/" component={PageLayout} />
          </Switch>
        </Provider>
      </Router>
    </ConfigProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
