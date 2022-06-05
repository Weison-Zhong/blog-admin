import React, { useEffect, useMemo, useState } from "react";
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
import { loadCSS } from "../utils/tools";
import "./index.less";
import KeepAlive, { AliveScope } from "react-activation";
import { Layout, Dropdown, Menu, Button } from "antd";
import { getBlogConfigApi } from "@/axios/api";
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
    //eslint-disable-next-line array-callback-return
    return _routes.map((route) => {
      //没有子路由
      if (route.component && !isArray(route.children)) {
        //二级及以上目录没有子路由
        if (level > 1) {
          return (
            <Item
              key={route.key}
              icon={<i className={`iconfont ${route.icon.key}`}></i>}
            >
              <Link to={`/${route.key}`}>{route.name}</Link>
            </Item>
          ); //-->塞进SubMenu里面
        }
        nodes.push(
          <Item
            key={route.key}
            icon={<i className={`iconfont ${route.icon.key}`}></i>}
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
              icon={<i className={`iconfont ${route.icon.key}`}></i>}
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
            icon={<i className={`iconfont ${route.icon.key}`}></i>}
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

export default function LayoutPage() {
  const history = useHistory();
  const userInfo = useSelector((state) => state.global.userInfo) || {};
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  let menus = useSelector((state) => state.global.menus) || [];
  const flattenRoutes = useMemo(() => getFlattenRoutes(menus) || [], []); // eslint-disable-line react-hooks/exhaustive-deps
  let selectedKeys = ["system/status"]; //默认展示欢迎页
  let defaultOpenKeys = ["system"];
  if (pathname.length > 1) {
    const pathArr = pathname.split("/"); //当前路由数组
    selectedKeys = [pathname.substring(1)]; //根据当前路由得出当前选中的菜单key值,如'system/role'
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
  const fetchBlogConfig = async () => {
    const res = await getBlogConfigApi();
    const { data, code } = res;
    if (code !== 200) return;
    const { iconLink } = data || {};
    iconLink && loadCSS(iconLink); //请求接口获取iconfont链接并引入
  };
  useEffect(() => {
    fetchBlogConfig();
  }, []);
  return (
    <Layout className="page-layout">
      <Header className="header">
        <div className="left">
          <div className="logo">
            <img src={require("../assets/images/logo.png")} alt="" />
          </div>
          <h5>钟伟胜博客后台管理系统</h5>
          <div className="links">
            <a
              href="http://www.weison-zhong.cn:5001/swagger/index.html"
              target="_blank"
              rel="noreferrer"
            >
              打开Api文档
            </a>
            <a
              href="https://github.com/Weison-Zhong/blog-admin/issues"
              target="_blank"
              rel="noreferrer"
            >
              有问题欢迎反馈issue
            </a>
          </div>
        </div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <div
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
          >
            <div className="right">
              <div className="user-info">
                <div className="avatar">
                  <img src={userInfo.avatar} alt="" />
                </div>
                <div className="username">{userInfo.userName}</div>
              </div>
            </div>
            <DownOutlined />
          </div>
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
            selectedKeys={selectedKeys}
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
