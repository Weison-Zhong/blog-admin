import React, { useEffect, useState } from "react";
import { getMenusApi, addOrUpdateMenuApi } from "@/axios/api";
import { Table, Button, Form, Input } from "antd";
import {
  PlusCircleOutlined,
  FormOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import FormModal from "@/components/FormModal";
const { Item } = Form;

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
  const [updatingMenu, setUpdatingMenu] = useState({});
  const columns = [
    { title: "名称", dataIndex: "name", key: "name" },
    { title: "图标", dataIndex: "icon", key: "icon" },
    { title: "路径", dataIndex: "key", key: "key" },
    { title: "组件目录", dataIndex: "componentPath", key: "componentPath" },
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
              icon={<PlusSquareOutlined />}
              onClick={() => handleAddSecondMenuClick(row)}
            />
            <Button
              type="primary"
              icon={<FormOutlined />}
              onClick={() => handleUpdateMenuClick(row)}
            />
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              style={{
                display: "inline-block",
                marginLeft: "10px",
              }}
              onClick={() => handleDeleteMenuClick(row)}
            />
          </div>
        );
      },
    },
  ];
  const handleAddSecondMenuClick = (row) => {
    console.log({ row });
  };
  const handleUpdateMenuClick = (row) => {
    setUpdatingMenu(row);
    setIsShowModal(true);
  };
  const handleDeleteMenuClick = () => {};
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
        title={"一级菜单"}
        updatingObj={updatingMenu}
        setUpdatingObj={setUpdatingMenu}
        submitBtnCallBack={addOrUpdateMenuApi}
      >
        <Item name="name" label="菜单名" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
        <Item name="key" label="路径" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
        <Item
          name="componentPath"
          label="组件目录"
          rules={[{ required: true }]}
        >
          <Input allowClear={true} />
        </Item>
        <Item name="icon" label="图标" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
        <Item name="keepAlive" label="是否缓存" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
        <Item
          name="parentMenuId"
          label="父级菜单"
          rules={[{ required: false }]}
        >
          <Input allowClear={true} />
        </Item>
      </FormModal>
    </>
  );
}
