import React, { memo,useState} from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { isArray } from "@/utils/is";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import './index.less'
const { Item } = Menu;
const {Sider} = Layout
const { SubMenu } = Menu;

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

export default memo(() => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const menus = useSelector((state) => state.global.menus) || [];
  let selectedKeys = ["system/status"]; //默认展示欢迎页
  let defaultOpenKeys = ["system"];
  if (pathname.length > 1) {
    const pathArr = pathname.split("/"); //当前路由数组
    selectedKeys = [pathname.substring(1)]; //根据当前路由得出当前选中的菜单key值,如'system/role'
    defaultOpenKeys = pathArr.splice(1); //根据当前路由得出当前默认展开的菜单
  }
  return (
    <Sider className="nav-bar" trigger={null} collapsible collapsed={collapsed}>
      <Button
        className="fold-btn"
        type="text"
        onClick={() => setCollapsed((collapsed) => !collapsed)}
        style={{ marginBottom: 16 }}
      >
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
      </Button>
      <Menu
        selectedKeys={selectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
      >
        {renderRoutes(menus)}
      </Menu>
    </Sider>
  );
});
