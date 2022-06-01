import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { loginApi } from "../../axios/api";
import { useDispatch } from "react-redux";
import { UPDATE_USERINFO, UPDATE_MENUS } from "@/redux/actionTypes";
import { LoadingOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import "./index.less";
import { useHistory } from "react-router-dom";
const { Item } = Form;
export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isRememberAccount, setIsRememberAccount] = useState(true);
  const onFinish = async (values) => {
    setIsLoading(true);
    const res = await loginApi(values);
    setIsLoading(false);
    // console.log("login res-->", res);
    const { data } = res;
    if (!data) return;
    const { token, menuList } = data || {};
    localStorage.setItem("WeisonToken", token);
    dispatch({
      type: UPDATE_USERINFO,
      payload: data,
    });
    dispatch({
      type: UPDATE_MENUS,
      payload: menuList,
    });
    if (isRememberAccount) {
      localStorage.setItem("username", JSON.stringify(values.username));
    } else localStorage.removeItem("username");
    history.push("/");
  };
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setIsRememberAccount(checked);
  };
  const pwdValidator = (_rule, value) => {
    if (!value) {
      return Promise.reject(new Error("密码不能为空"));
    } else if (value.length > 32) {
      return Promise.reject(new Error("密码不能大于32位"));
    } else if (value.length < 3) {
      return Promise.reject(new Error("密码不能小于3位"));
    }
    return Promise.resolve();
  };
  const fillFormInitialValues = () => {
    const rememberUserName = localStorage.getItem("username");
    // console.log({ rememberUserName });
    if (rememberUserName) {
      return {
        username: JSON.parse(rememberUserName),
      };
    } else {
      return {
        username: "admin",
        password: "123456",
      };
    }
  };
  return (
    <div className="login-page">
      <div className="left">
        <header>钟伟胜博客后台管理系统</header>
      </div>
      <div className="right">
        <div className="content">
          <h5>欢迎使用后台管理系统</h5>
          <a
            href="http://www.weison-zhong.cn:8081"
            target="_blank"
            rel="noreferrer"
          >
            已开放公共帐号:admin 密码:123456
            <br />
            (仅8081端口开源,点击可前往)
          </a>
          <Form
            className="form"
            initialValues={fillFormInitialValues()}
            onFinish={onFinish}
          >
            <Item
              name="username"
              rules={[{ required: true, message: "帐号不能为空" }]}
            >
              <Input
                allowClear={true}
                placeholder="帐号"
                type="text"
                prefix={<UserOutlined />}
              />
            </Item>
            <Item
              name="password"
              rules={[{ validator: pwdValidator, required: true }]}
            >
              <Input.Password
                allowClear={true}
                autoComplete="new-password"
                placeholder="密码"
                type="password"
                prefix={<LockOutlined />}
              />
            </Item>
            <Checkbox
              checked={isRememberAccount}
              onChange={handleCheckboxChange}
            >
              记住帐号
            </Checkbox>
            <Button
              type="primary"
              htmlType="submit"
              icon={isLoading ? <LoadingOutlined /> : null}
              style={{ width: "100%", marginTop: "15px" }}
            >
              {isLoading ? "登录中" : "登录"}
            </Button>
          </Form>
        </div>
        <footer>
          <a
            href="https://github.com/Weison-Zhong"
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
        </footer>
      </div>
    </div>
  );
}
