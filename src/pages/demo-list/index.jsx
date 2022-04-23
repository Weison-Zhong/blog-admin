import React, { useEffect, useState } from "react";
import { Button, Table, Form, Input, message, InputNumber, Switch } from "antd";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  addDemoApi,
  deleteDemoApi,
  updateDemoApi,
  getDemosApi,
} from "@/axios/api";
import "./index.less";
import ImgUpload from "@/components/ImgUpload";
import FormModal from "@/components/FormModal";
import DeleteModal from "@/components/DeleteModal";
const { Item } = Form;
const formConfig = {
  width: 550,
  layout: {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  },
  tailLayout: {
    wrapperCol: { offset: 6, span: 16 },
  },
};
let imgFile = null;
export default function DemoList() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingDemo, setUpdatingDemo] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingDemo, setDeletingDemo] = useState({});
  const [demoList, setDemoList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const columns = [
    {
      title: "序号",
      width: 80,
      dataIndex: "index",
      align: "center",
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      textWrap: "word-break",
      align: "center",
    },
    {
      title: "更新时间",
      width: 180,
      key: "updatedDate",
      dataIndex: "updatedDate",
      align: "center",
    },
    {
      title: "是否展示",
      width: 100,
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (status, row) => {
        return (
          <Switch
            checked={status}
            loading={loading}
            onChange={() => handleToggleStatusClick(row)}
          />
        );
      },
    },
    {
      title: "操作",
      key: "operation",
      width: 130,
      align: "center",
      render: (row) => {
        return (
          <div>
            <Button
              type="primary"
              icon={<FormOutlined />}
              onClick={() => handleEditArticleClick(row)}
            />
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              style={{
                display: "inline-block",
                marginLeft: "10px",
              }}
              onClick={() => handleDeleteArticleClick(row)}
            />
          </div>
        );
      },
    },
  ];
  function handleDeleteArticleClick(row) {
    setDeletingDemo(row);
  }
  function handleEditArticleClick(row) {
    setUpdatingDemo(row);
    setImageUrl(row.coverImgUrl);
    setIsShowModal(true);
  }
  function handleToggleStatusClick(row) {
    setLoading(true);
    // const res = await toggleArticleStatusApi(row.id);
    // const { code, msg } = res || {};
    // if (code === 200) {
    //   message.success(msg);
    //   this.fetchArticleList();
    // }
    setLoading(false);
  }
  async function fetchDemos() {
    const res = await getDemosApi();
    //若axios没有加全局拦截器，那么走不到这里，控制台会报Uncaught (in promise) Error错误，但是如果上面await那里加了catch则可以继续执行，res是undefined;
    //若axios的interceptors.response.use()第二个参数有处理，则返回我们return的东西。
    const { code, data } = res || {};
    console.log({ res });
    if (code !== 200) return;
    data.forEach((item, i) => (item.index = i + 1));
    setDemoList(data);
  }

  //新增或修改Demo
  const handleSubmit = async (newDemo) => {
    setIsSubmitting(true);
    try {
      const { id } = updatingDemo || {};
      console.log({ newDemo });
      newDemo.status = Number(newDemo.status);
      const demoForm = new FormData();
      //遍历antd表单数据插入formdata
      for (let key in newDemo) {
        demoForm.append(key, newDemo[key]);
      }
      demoForm.append("coverImage", imgFile);
      let res = null;
      if (id) {
        //修改
        res = await updateDemoApi(id, demoForm);
      } else {
        //新增
        res = await addDemoApi(demoForm);
      }
      setIsSubmitting(false);
      const { code, msg } = res;
      if (code !== 200) return;
      fetchDemos();
      setIsShowModal(false);
      message.success(msg);
    } catch (error) {
      message.error("保存失败，请重试");
      setIsSubmitting(false);
      console.log("Failed:", error);
    }
  };
  //删除Demo
  async function handleDeleteDemo() {
    const { id } = deletingDemo || {};
    if (!id) return;
    const res = await deleteDemoApi(id);
    const { code, msg } = res || {};
    if (code !== 200) return;
    message.success(msg);
    setDeletingDemo({});
    fetchDemos();
  }
  //初始化
  useEffect(() => {
    fetchDemos();
  }, []);

  return (
    <div className="demo-list">
      <div className="content-container">
        <Button type="primary" onClick={() => setIsShowModal(true)}>
          添加Demo
        </Button>
        <Table columns={columns} dataSource={demoList} rowKey="id" />
      </div>
      <FormModal
        formConfig={formConfig}
        title={"Demo"}
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        isSubmitting={isSubmitting}
        updatingObj={updatingDemo}
        setUpdatingObj={setUpdatingDemo}
        submitBtnCallBack={handleSubmit}
        initialValues={{
          menuId: updatingDemo.belongMenu && updatingDemo.belongMenu.menuId,
        }}
      >
        <Item name="title" label="Api名" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
        <Item name="description" label="说明" rules={[{ required: false }]}>
          <Input.TextArea allowClear={true} />
        </Item>
        <Item name="weight" label="权重" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Item>
        <Item
          label="状态"
          name="status"
          rules={[{ required: false }]}
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="上架" unCheckedChildren="隐藏" />
        </Item>
        <Item label="封面图" className="cover-img-upload">
          <ImgUpload
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            fileChange={(originFileObj) => {
              imgFile = originFileObj;
            }}
          />
        </Item>
      </FormModal>
      <DeleteModal
        deletingObj={deletingDemo}
        setDeletingObj={setDeletingDemo}
        onDelete={handleDeleteDemo}
      />
    </div>
  );
}
