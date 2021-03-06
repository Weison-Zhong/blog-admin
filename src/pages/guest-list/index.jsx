import React, { Component } from "react";
import { getGuestsApi } from "@/axios/api";
import { Table } from "antd";
import { isArray } from "@/utils/is";
let pageNumber = 1,
  pageSize = 10,
  total = 0;
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
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  handlePageSizeChange = (newPageNum, newPageSize) => {
    pageNumber = newPageNum;
    pageSize = newPageSize;
    this.fetchGuests();
  };
  handlePageNumerChange = (newPageNum, newPageSize) => {
    pageNumber = newPageNum;
    pageSize = newPageSize;
    this.fetchGuests();
  };
  fetchGuests = async () => {
    this.setState({ guests: [] });
    const params = {
      pageNumber,
      pageSize,
    };
    const res = await getGuestsApi(params);
    const { code, data } = res || {};
    if (code !== 200) return;
    const { guests, totalCount } = data;
    total = totalCount;
    if (isArray(guests)) {
      guests.forEach((item, i) => (item.index = i + 1));
      this.setState({ guests });
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
        sorter: (a, b) => Date.parse(a.createdDate) - Date.parse(b.createdDate),
      },
      {
        title: "最新访问",
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
          return `${country}${province}${city}`;
        },
      },
    ];
    return (
      <div className="article-list">
        <div className="content-container">
          <Table
            columns={columns}
            dataSource={this.state.guests}
            rowKey="index"
            scroll={{ y: "calc(100vh - 185px)" }}
            pagination={{
              showSizeChanger: true,
              onShowSizeChange: this.handlePageSizeChange,
              onChange: this.handlePageNumerChange,
              total,
            }}
          />
        </div>
      </div>
    );
  }
}
