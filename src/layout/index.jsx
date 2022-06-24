import React, { memo, useMemo } from "react";
import Loadable from "react-loadable";
import { isArray } from "@/utils/is";
import { Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import "./index.less";
import KeepAlive, { AliveScope } from "react-activation";
import { Layout } from "antd";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import { Loading } from "weison-react-uilib";
const { Content } = Layout;

function getFlattenRoutes(routes) {
  const res = [];
  function travel(_routes) {
    _routes.forEach((route) => {
      if (route.componentPath) {
        route.component = Loadable({
          loader: () => import(`../pages/${route.componentPath}`),
          loading: Loading,
          delay: 300,
        });
        res.push(route);
      }
      if (isArray(route.children) && route.children.length) {
        travel(route.children);
      }
    });
  }
  travel(routes);
  return res;
}

export default memo(() => {
  let menus = useSelector((state) => state.global.menus) || [];
  const flattenRoutes = useMemo(() => getFlattenRoutes(menus) || [], []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Layout className="page-layout">
      <Header />
      <Layout>
        <NavBar />
        <Content className="content">
          <AliveScope>
            <Switch>
              {flattenRoutes.map((route) => {
                return (
                  <Route
                    key={route.key}
                    path={`/${route.key}`}
                    // component={route.component}原本未缓存路由组件
                    render={(props) => {
                      return (
                        <KeepAlive
                          saveScrollPosition={true}
                          id={route.key}
                          when={route.keepAlive}
                        >
                          <route.component {...props} />
                        </KeepAlive>
                      );
                    }}
                  />
                );
              })}
              <Redirect push to="/system/status" />
            </Switch>
          </AliveScope>
        </Content>
      </Layout>
    </Layout>
  );
});
