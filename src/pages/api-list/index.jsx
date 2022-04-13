import React, { useEffect, useState } from "react";
import { Button, Table, Form, Input, message, Select } from "antd";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  addApiApi,
  deleteApiApi,
  updateApiApi,
  getApisApi,
  getMenusApi,
} from "../../axios/api";
import FormModal from "@/components/FormModal";
import DeleteModal from "@/components/DeleteModal";
const { Item } = Form;
const { Option } = Select;
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

export default function ApiList() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [updatingApi, setUpdatingApi] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingApi, setDeletingApi] = useState({});
  const [ApiList, setApiList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center",
    },
    {
      title: "接口名",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      textWrap: "word-break",
      width: 150,
      align: "center",
    },
    {
      title: "路径",
      dataIndex: "key",
      key: "key",
      ellipsis: true,
      textWrap: "word-break",
      width: 300,
      align: "center",
    },
    {
      title: "所属菜单",
      width: 200,
      dataIndex: "createdDate",
      align: "center",
      render: (_, row) => {
        const { menuName } = row.menu || {};
        return menuName;
      },
    },
    {
      title: "说明",
      dataIndex: "description",
      align: "center",
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
              onClick={() => handleEditApiClick(row)}
            />
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              style={{
                display: "inline-block",
                marginLeft: "10px",
              }}
              onClick={() => handleDeleteApiClick(row)}
            />
          </div>
        );
      },
    },
  ];
  function handleDeleteApiClick(row) {
    setDeletingApi(row);
  }
  async function fetchApis() {
    const res = await getApisApi();
    //若axios没有加全局拦截器，那么走不到这里，控制台会报Uncaught (in promise) Error错误，但是如果上面await那里加了catch则可以继续执行，res是undefined;
    //若axios的interceptors.response.use()第二个参数有处理，则返回我们return的东西。
    const { code, data } = res || {};
    console.log({ res });
    if (code !== 200) return;
    data.forEach((item, i) => (item.index = i + 1));
    setApiList(data);
  }
  //请求菜单数据并摊平一维数组
  async function fetchMenus() {
    const res = await getMenusApi();
    const { code, data } = res || {};
    if (code !== 200) return;
    setMenuList(data);
  }
  //新增或修改API
  const handleSubmit = async (newApi) => {
    const { id } = updatingApi;
    setIsSubmitting(true);
    let res = null;
    if (id) {
      //修改
      newApi.id = id;
      res = await updateApiApi(newApi);
    } else {
      //新增
      res = await addApiApi(newApi);
    }
    setIsSubmitting(false);
    const { code, msg } = res || {};
    if (code !== 200) return;
    message.success(msg);
    setIsShowModal(false);
    fetchApis();
  };
  //删除Api
  async function handleDeleteApi() {
    const { id } = deletingApi || {};
    if (!id) return;
    const res = await deleteApiApi(id);
    const { code, msg } = res || {};
    if (code !== 200) return;
    message.success(msg);
    setDeletingApi({});
    fetchApis();
  }
  //修改Api按钮
  function handleEditApiClick(row) {
    setUpdatingApi(row);
    setIsShowModal(true);
  }
  //初始化
  useEffect(() => {
    fetchApis();
    fetchMenus();
  }, []);

  return (
    <div className="api-list">
      <div className="content-container">
        <Button type="primary" onClick={() => setIsShowModal(true)}>
          添加Api
        </Button>
        <Table columns={columns} dataSource={ApiList} rowKey="id" />
      </div>
      <FormModal
        formConfig={formConfig}
        title={"Api"}
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        isSubmitting={isSubmitting}
        updatingObj={updatingApi}
        setUpdatingObj={setUpdatingApi}
        submitBtnCallBack={handleSubmit}
        initialValues={{ menuId: updatingApi.menu && updatingApi.menu.menuId }}
      >
        <Item name="title" label="Api名" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
        <Item name="key" label="路径" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
        <Item name="description" label="说明" rules={[{ required: false }]}>
          <Input.TextArea allowClear={true} />
        </Item>
        <Item name="menuId" label="所属菜单" rules={[{ required: false }]}>
          <Select
            style={{ width: 220 }}
            placeholder="请选择所属菜单"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              const children = option.children.toString();
              if (typeof children === "undefined") {
                return null;
              } else {
                return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }
            }}
          >
            {menuList.map((item) => (
              <Option key={item.id}>{item.name}</Option>
            ))}
          </Select>
        </Item>
      </FormModal>
      <DeleteModal
        deletingObj={deletingApi}
        setDeletingObj={setDeletingApi}
        onDelete={handleDeleteApi}
      />
    </div>
  );
}
