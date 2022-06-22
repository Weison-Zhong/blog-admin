import React, { memo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./index.less";
import { Layout, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
const { Header } = Layout;
export default memo(() => {
  const history = useHistory();
  const userInfo = useSelector((state) => state.global.userInfo) || {};
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
    <Header className="header">
      <div className="left">
        <div className="logo">
          <img src={require("@/assets/images/logo.png")} alt="" />
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
        <div className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
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
  );
});
