import React, { Component } from "react";
import { getMenusApi } from "@/axios/api";
import { Table } from "antd";

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
export default class MenuList extends Component {
  constructor() {
    super();
    this.state = {
      menus: [],
    };
  }
  async fetchMenus() {
    const res = await getMenusApi();
    const { code, data } = res;
    console.log({res});
    if (code !== 200) return;
    this.setState({
      menus: data,
    });
  }
  componentDidMount() {
    this.fetchMenus();
  }
  render() {
    return (
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.description}</p>
          ),
          rowExpandable: (record) => record.name !== "Not Expandable",
        }}
        dataSource={this.state.menus}
      />
    );
  }
}
