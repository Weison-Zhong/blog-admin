import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Switch,
  Route,
  Redirect,
  Link,
  useLocation,
  useHistory,
} from "react-router-dom";
import loadable from "@loadable/component";
import { isArray } from "../utils/is";
import "./index.less";
import menus from "../router/routes";
import KeepAlive, { AliveScope } from "react-activation";
import { Layout, Dropdown } from "antd";
import { Menu, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from "@ant-design/icons";
const { Header, Sider, Content } = Layout;
const { Item } = Menu;
const { SubMenu } = Menu;
function getFlattenRoutes(routes) {
  const res = [];
  function travel(_routes) {
    _routes.forEach((route) => {
      if (route.componentPath) {
        route.component = loadable(() =>
          import(`../pages/${route.componentPath}`)
        );
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

function renderRoutes(routes) {
  const nodes = [];
  function travel(_routes, level) {
    return _routes.map((route) => {
      //没有子路由
      if (route.component && !isArray(route.children)) {
        //二级及以上目录没有子路由
        if (level > 1) {
          return (
            <Item
              key={route.key}
              icon={<i className={`iconfont ${route.icon}`}></i>}
            >
              <Link to={`/${route.key}`}>{route.name}</Link>
            </Item>
          ); //-->塞进SubMenu里面
        }
        nodes.push(
          <Item
            key={route.key}
            icon={<i className={`iconfont ${route.icon}`}></i>}
          >
            <Link to={`/${route.key}`}>{route.name}</Link>
          </Item>
        );
      }
      //存在一个以上子路由
      if (isArray(route.children) && route.children.length) {
        //存在3级及以上目录情况,需要再包一层SubMenu
        if (level > 1) {
          return (
            <SubMenu
              key={route.key}
              icon={<i className={`iconfont ${route.icon}`}></i>}
            >
              {travel(route.children, level + 1)}
            </SubMenu>
          );
        }
        //进入二级目录递归子路由
        nodes.push(
          <SubMenu
            key={route.key}
            title={route.name}
            icon={<i className={`iconfont ${route.icon}`}></i>}
          >
            {travel(route.children, level + 1)}
          </SubMenu>
        );
      }
    });
  }
  travel(routes, 1); //从1级目录进入递归
  return nodes;
}

export default function Home() {
  const history = useHistory();
  const userInfo = useSelector((state) => state.global.userInfo) || {};
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  // let menus = useSelector((state) => state.global.menus) || [];
  console.log({ menus });
  const flattenRoutes = useMemo(() => getFlattenRoutes(menus) || [], []);
  let defaultSelectedKeys = ["system/status"]; //默认展示欢迎页
  let defaultOpenKeys = ["system"];
  if (pathname) {
    const pathArr = pathname.split("/"); //当前路由数组
    defaultSelectedKeys = [pathname.substring(1)]; //根据当前路由得出当前选中的菜单key值,如'system/role'
    defaultOpenKeys = pathArr.splice(1); //根据当前路由得出当前默认展开的菜单
  }
  function toggleCollapsed() {
    setCollapsed((collapsed) => !collapsed);
  }
  const logout = () => {
    localStorage.removeItem("WeisonToken");
    history.push("/login");
  };
  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={logout}>
        退出
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout className="page-layout">
      <Header className="header">
        <div className="left">
          <div className="logo"></div>
          <h5>a</h5>
        </div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            <div className="right">
              <div className="user-info">
                <div className="avatar">
                  <img src={userInfo.avatar} alt="" />
                </div>
                <div className="username">{userInfo.userName}</div>
              </div>
            </div>
            <DownOutlined />
          </a>
        </Dropdown>
      </Header>
      <Layout>
        <Sider
          className="nav-bar"
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <Button
            className="fold-btn"
            type="text"
            onClick={toggleCollapsed}
            style={{ marginBottom: 16 }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
            )}
          </Button>
          <Menu
            selectedKeys={defaultSelectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            mode="inline"
          >
            {renderRoutes(menus)}
          </Menu>
        </Sider>
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
}
