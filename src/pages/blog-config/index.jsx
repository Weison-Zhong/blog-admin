import React, { Component } from "react";
import "./index.less";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Form, Input, Upload } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getBlogConfigApi, updateBlogConfigApi } from "@/axios/api";
const { Item } = Form;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
let resumeFile = null;
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
    const formData = new FormData();
    //遍历antd表单数据插入formdata
    for (let key in data) {
      const val = data[key];
      val && formData.append(key, data[key]);
    }
    resumeFile && formData.append("resumeFile", resumeFile);
    const res = await updateBlogConfigApi(formData);
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
    const { resumeUrl } = data || {};
    resumeUrl && setPdfUrl(resumeUrl);
    setTimeout(() => {
      this.formRef.current && this.formRef.current.setFieldsValue(data);
    }, 0);
  };
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
            <Input.TextArea allowClear={true} />
          </Item>
          <Item
            name="iconLink"
            label="阿里IconFont链接"
            rules={[{ required: false }]}
          >
            <Input allowClear={true} />
          </Item>
          <Item label="个人简历" rules={[{ required: false }]}>
            <Upload
              showUploadList={false}
              customRequest={() => {}} //防止upload封装的action事件触发
              onChange={handleChange}
              className=""
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: "20px" }}
              icon={isSubmitting ? <LoadingOutlined /> : null}
            >
              {isSubmitting ? "保存中" : "保存"}
            </Button>
          </Item>
        </Form>
        <embed id="pdf-container" type="application/pdf" />
      </div>
    );
  }
}

function handleChange(info) {
  const { originFileObj } = info.file;
  if (typeof originFileObj !== "object")
    return message.error("上传文件格式有误，请检查");
  const { type, size } = originFileObj || {};
  const isPdf = type.includes("pdf");
  if (!isPdf) {
    return message.error("仅可上传Pdf格式文件");
  }
  const isLt10M = size / 1024 / 1024 < 10;
  if (!isLt10M) {
    return message.error("文件不能大于 10MB");
  }
  resumeFile = originFileObj;
  const url = window.URL.createObjectURL(originFileObj);
  setPdfUrl(url);
}

function setPdfUrl(url) {
  if (typeof url !== "string") return message.error("简历文件路径有误，请检查");
  const pdfContainer = document.getElementById("pdf-container");
  if (typeof pdfContainer !== "object") return;
  pdfContainer.setAttribute("src", url);
}
