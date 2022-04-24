import React, { Component } from "react";
import "./index.less";
import { Button, message, Form, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getBlogConfigApi, updateBlogConfigApi } from "@/axios/api";
const { Item } = Form;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};
export default class BlogConfig extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isSubmitting: false,
    };
  }
  handleFormSubmit = async (data) => {
    this.setState({
      isSubmitting: true,
    });
    const res = await updateBlogConfigApi(data);
    this.setState({
      isSubmitting: false,
    });
    const { code, msg } = res || {};
    if (code !== 200) return;
    this.fetchBlogConfig();
    message.success(msg);
  };
  fetchBlogConfig = async () => {
    const res = await getBlogConfigApi();
    console.log({ res });
    const { code, data } = res || {};
    if (code !== 200 || !data) return;
    setTimeout(() => {
      this.formRef.current && this.formRef.current.setFieldsValue(data);
    }, 0);
  };
  resetFormData = () => this.formRef.current.resetFields();
  handleModalClose = () => this.resetFormData();
  componentDidMount() {
    this.fetchBlogConfig();
  }
  render() {
    const { isSubmitting } = this.state;
    return (
      <div className="blog-config">
        <Form {...layout} ref={this.formRef} onFinish={this.handleFormSubmit}>
          <Item
            name="firstText"
            label="博客首页第一行"
            rules={[{ required: true }]}
          >
            <Input allowClear={true} />
          </Item>
          <Item
            name="secondText"
            label="博客首页第二行"
            rules={[{ required: false }]}
          >
            <Input allowClear={true} />
          </Item>
          <Item
            name="thirdText"
            label="博客首页第三行"
            rules={[{ required: false }]}
          >
            <Input allowClear={true} />
          </Item>
          <Item
            name="iconLink"
            label="阿里IconFont链接"
            rules={[{ required: false }]}
          >
            <Input allowClear={true} />
          </Item>
          <Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              icon={isSubmitting ? <LoadingOutlined /> : null}
            >
              {isSubmitting ? "提交中" : "提交"}
            </Button>
            <Button
              htmlType="button"
              onClick={this.resetFormData}
              style={{
                display: "inline-block",
                marginLeft: "10px",
              }}
            >
              重置所有
            </Button>
          </Item>
        </Form>
      </div>
    );
  }
}
