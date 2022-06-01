import React, { Component } from "react";
import "./index.less";
import { Button, Popconfirm, message, Modal, Form, Input, Empty } from "antd";
import {
  FormOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  deleteIconApi,
  getIconsApi,
  updateIconApi,
  addIconApi,
} from "@/axios/api";
const { Item } = Form;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};
export default class IconList extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isShowModal: false,
      icons: [],
      updatingIcon: {},
      isSubmitting: false,
    };
  }
  resetFormData = () => this.formRef.current.resetFields();
  handleModalClose = () => {
    this.resetFormData();
    this.setState({
      updatingIcon: {},
    });
  };
  handleFormSubmit = async (data) => {
    this.setState({
      isSubmitting: true,
    });
    const { id } = this.state.updatingIcon;
    let res = null;
    if (id) {
      //修改
      res = await updateIconApi(id, data);
    } else {
      //新增
      res = await addIconApi(data);
    }
    this.setState({
      isSubmitting: false,
    });
    const { code, msg } = res || {};
    if (code !== 200) return;
    this.fetchIcons();
    this.setState({
      isShowModal: false,
      updatingIcon: {},
    });
    message.success(msg);
  };
  handleEditEditClick(item) {
    this.setState({
      updatingIcon: item,
      isShowModal: true,
    });
    setTimeout(() => {
      this.formRef.current && this.formRef.current.setFieldsValue(item);
    }, 0);
  }
  async handleDeleteIcon(item) {
    const res = await deleteIconApi(item.id);
    const { code, msg } = res || {};
    if (code !== 200) return message.error("删除失败，请重试");
    this.fetchIcons();
    message.success(msg);
  }
  async fetchIcons() {
    const res = await getIconsApi();
    const { code, data } = res || {};
    if (code !== 200) return message.error("获取数据失败，请重试");
    this.setState({
      icons: data,
    });
  }
  componentDidMount() {
    this.fetchIcons();
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    const { icons, isShowModal, isSubmitting, updatingIcon } = this.state;
    return (
      <div className="icon-list">
        <Button
          type="primary"
          onClick={() => this.setState({ isShowModal: true })}
        >
          添加Icon
        </Button>
        {icons.length ? (
          <ul>
            {icons.map((item, i) => {
              const { name, key } = item;
              return (
                <li key={i}>
                  {key.includes("icon") ? (
                    <>
                      <i className={`iconfont ${key}`}></i>
                      <span>{name}</span>
                      <span>{key}</span>
                    </>
                  ) : (
                    <>
                      <img src={key} alt="" />
                      <span>{name}</span>
                    </>
                  )}
                  <div>
                    <Button
                      icon={<FormOutlined />}
                      onClick={() => this.handleEditEditClick(item)}
                    />
                    <Popconfirm
                      title={`确定要删除图标: ${name} 吗?`}
                      onConfirm={() => this.handleDeleteIcon(item)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty />
        )}

        <Modal
          title={updatingIcon.id ? "修改Icon" : "新增Icon"}
          visible={isShowModal}
          footer={null}
          width={500}
          afterClose={this.handleModalClose}
          onCancel={() => this.setState({ isShowModal: false })}
        >
          <Form {...layout} ref={this.formRef} onFinish={this.handleFormSubmit}>
            <Item name="name" label="Icon名" rules={[{ required: true }]}>
              <Input allowClear={true} />
            </Item>
            <Item name="key" label="key或Url" rules={[{ required: true }]}>
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
        </Modal>
      </div>
    );
  }
}
