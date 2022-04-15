import React, { Component } from "react";
import { getGuestsApi } from "@/axios/api";
import { Table } from "antd";
import { isArray } from "@/utils/is";
export default class GuestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guests: [],
    };
  }
  componentDidMount() {
    this.fetchGuests();
  }
  fetchGuests = async () => {
    const res = await getGuestsApi();
    const { code, data } = res || {};
    if (code !== 200) return;
    if (isArray(data)) {
      data.forEach((item, i) => (item.index = i + 1));
      this.setState({ guests: data });
    }
  };
  render() {
    const columns = [
      {
        title: "序号",
        width: 80,
        dataIndex: "index",
        align: "center",
      },
      {
        title: "访问次数",
        dataIndex: "accessCount",
        key: "accessCount",
        width: 105,
        align: "center",
        sorter: (a, b) => a.accessCount - b.accessCount,
      },
      {
        title: "创建时间",
        dataIndex: "createdDate",
        key: "createdDate",
        width: 180,
        align: "center",
        defaultSortOrder: "descend",
        sorter: (a, b) => Date.parse(a.createdDate) - Date.parse(b.createdDate),
      },
      {
        title: "最后访问",
        width: 180,
        key: "updatedDate",
        dataIndex: "updatedDate",
        align: "center",
        sorter: (a, b) => Date.parse(a.updatedDate) - Date.parse(b.updatedDate),
      },
      {
        title: "地址",
        key: "address",
        ellipsis: true,
        textWrap: "word-break",
        align: "center",
        render: (_, row) => {
          const { country, province, city } = row || {};
          return `${country}${province}省${city}市`;
        },
      },
    ];
    return (
      <div className="article-list">
        <div className="content-container">
          <Table columns={columns} dataSource={this.state.guests} rowKey="id" />
        </div>
      </div>
    );
  }
}
