import React from "react";
import ReactDOM from "react-dom";
import "./index.less";
import "antd/dist/antd.min.css";
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
const store = createStore(rootReducer);

function App() {
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
