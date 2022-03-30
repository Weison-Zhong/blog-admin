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
        name: "用户管理",
        key: "system/user",
        componentPath: "user-manage",
        icon: <UserOutlined />,
        keepAlive: false,
      },
      {
        name: "角色管理",
        key: "system/role",
        componentPath: "role-manage",
        icon: <IconFont type="icon-yewujiaose" />,
        keepAlive: true,
      },
      {
        name: "权限管理",
        key: "system/permission",
        componentPath: "permission-manage",
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
        name: "新增文章",
        key: "article/add",
        componentPath: "article-manage",
        icon: <UserOutlined />,
        keepAlive: false,
      },
    ],
  },
];

export default routes;
