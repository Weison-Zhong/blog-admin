import React, { useEffect, useState } from "react";
import { getMenusApi } from "@/axios/api";
import { Table, Button, Form, Input } from "antd";
import { PlusCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import FormModal from "@/components/FormModal";
const { Item } = Form;
const columns = [
  { title: "名称", dataIndex: "name", key: "name" },
  { title: "图标", dataIndex: "icon", key: "icon" },
  { title: "路径", dataIndex: "key", key: "key" },
  { title: "组件目录", dataIndex: "componentPath", key: "componentPath" },
  {
    title: "操作",
    dataIndex: "",
    key: "x",
    render: () => <a>Delete</a>,
  },
];
let form = null;
const formConfig = {
  layout: {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  },
  tailLayout: {
    wrapperCol: { offset: 4, span: 18 },
  },
};
const expandable = {
  defaultExpandAllRows: true,
  expandRowByClick: true,
};
export default function MenuList() {
  form = Form.useForm()[0];
  const [menus, setMenus] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);

  const fetchMenus = async () => {
    const res = await getMenusApi();
    const { code, data } = res;
    console.log({ res });
    if (code !== 200) return;
    setMenus(data);
  };
  useEffect(() => {
    fetchMenus();
  }, []);
  return (
    <>
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => {
          setIsShowModal(true);
        }}
      >
        新增一级菜单
      </Button>
      <Table columns={columns} dataSource={menus} expandable={expandable} />
      <FormModal
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        formConfig={formConfig}
        width={500}
        
      >
        <Item name="name" label="用户名" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
        <Item name="password" label="密码">
          <Input.Password allowClear={true} />
        </Item>
      </FormModal>
    </>
  );
}
