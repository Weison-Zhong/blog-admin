import React from "react";
import { ContainerOutlined, UserOutlined } from "@ant-design/icons";
import {
  createFromIconfontCN,
  SettingOutlined,
  KeyOutlined,
} from "@ant-design/icons";
const IconFont = createFromIconfontCN({
  scriptUrl: ["//at.alicdn.com/t/font_3152343_grj318fjx55.js"],
});
const routes = [
  {
    name: "欢迎页",
    key: "welcome",
    componentPath: "welcome",
    icon: <ContainerOutlined />,
    keepAlive: false,
  },
  {
    name: "系统设置",
    key: "system",
    icon: <SettingOutlined />,
    children: [
      {
        name: "运行监测",
        key: "system/status",
        componentPath: "system-status",
        icon: "icon-wechat-fill",
        keepAlive: false,
      },
      {
        name: "用户列表",
        key: "system/user",
        componentPath: "user-list",
        icon: <UserOutlined />,
        keepAlive: false,
      },
      {
        name: "角色列表",
        key: "system/role",
        componentPath: "role-list",
        icon: <IconFont type="icon-yewujiaose" />,
        keepAlive: false,
      },
      {
        name: "菜单列表",
        key: "system/menu",
        componentPath: "menu-list",
        icon: <UserOutlined />,
        keepAlive: false,
      },
      {
        name: "Api列表",
        key: "system/api",
        componentPath: "api-list",
        icon: <KeyOutlined />,
        keepAlive: false,
      },
    ],
  },
  {
    name: "文章管理",
    key: "article",
    icon: <SettingOutlined />,
    children: [
      {
        name: "文章列表",
        key: "article/list",
        componentPath: "article-list",
        icon: <UserOutlined />,
        keepAlive: false,
      },
      {
        name: "编辑文章",
        key: "article/edit",
        componentPath: "article-edit",
        icon: <UserOutlined />,
        keepAlive: false,
      },
    ],
  },
  {
    name: "博客管理",
    key: "blog",
    icon: <SettingOutlined />,
    children: [
      {
        name: "网站配置",
        key: "blog/config",
        componentPath: "blog-config",
        icon: <UserOutlined />,
        keepAlive: false,
      },
      {
        name: "访客列表",
        key: "blog/guest",
        componentPath: "guest-list",
        icon: <UserOutlined />,
        keepAlive: false,
      },
      {
        name: "Icon列表",
        key: "blog/icon",
        componentPath: "icon-list",
        icon: <UserOutlined />,
        keepAlive: false,
      },
      {
        name: "Demo列表",
        key: "blog/demo",
        componentPath: "demo-list",
        icon: <KeyOutlined />,
        keepAlive: false,
      },
    ],
  },
];

export default routes;
