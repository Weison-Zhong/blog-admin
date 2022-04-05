import React, { useEffect, useState } from "react";
import { getMenusApi } from "@/axios/api";
import { Table, Switch, Space } from "antd";

const columns = [
  { title: "名称", dataIndex: "name", key: "name" },
  { title: "路径", dataIndex: "key", key: "key" },
  { title: "组件目录", dataIndex: "componentPath", key: "componentPath" },
  { title: "图标", dataIndex: "icon", key: "icon" },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => <a>Delete</a>,
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};
export default function MenuList() {
  const [checkStrictly, setCheckStrictly] = useState(false);
  const [menus, setMenus] = useState([]);
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
      <Space align="center" style={{ marginBottom: 16 }}>
        <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space>
      <Table
        columns={columns}
        rowSelection={{ ...rowSelection, checkStrictly }}
        dataSource={menus}
      />
    </>
  );
}
