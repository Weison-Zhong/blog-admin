import React from "react";
import { Form, Input, Button, message } from "antd";
import { loginApi } from "../../axios/api";
import { useDispatch } from "react-redux";
import { UPDATE_USERINFO, UPDATE_MENUS } from "@/redux/actionTypes";
import "./index.less";
import { useHistory } from "react-router-dom";
export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const onFinish = async (values) => {
    const res = await loginApi(values);
    console.log("login res-->", res);
    const { data } = res;
    if (!data) return message.error("Token值有误，请联系管理员");
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
    history.push("/");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
