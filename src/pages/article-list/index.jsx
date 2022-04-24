import React, { Component } from "react";
import { Button, Table, message, Switch, Input, Space } from "antd";
import "./index.less";
import {
  FormOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {
  getArticlesApi,
  toggleArticleStatusApi,
  deleteArticleApi,
} from "@/axios/api";
import { isArray } from "@/utils/is";
import DeleteModal from "@/components/DeleteModal";
let searchInput = null;

export default class ArticleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleList: [],
      loading: false,
      deletingArticle: {},
      searchText: "",
      searchedColumn: "",
    };
  }
  componentDidMount() {
    this.fetchArticleList();
  }
  fetchArticleList = async () => {
    const res = await getArticlesApi();
    const { code, data } = res || {};
    if (code !== 200) return;
    console.log({ data });
    const { articles } = data || {};
    if (isArray(articles)) {
      articles.forEach((item, i) => (item.index = i + 1));
      this.setState({ articleList: articles });
    }
  };
  handleEditArticleClick = (row) => {
    this.props.history.push(`/article/edit?articleId=${row.id}`);
  };
  handleDeleteArticleClick = (row) => {
    this.setState({ deletingArticle: row });
  };
  handleToggleStatusClick = async (row) => {
    this.setState({ loading: true });
    const res = await toggleArticleStatusApi(row.id);
    const { code, msg } = res || {};
    if (code === 200) {
      message.success(msg);
      this.fetchArticleList();
    }
    this.setState({ loading: false });
  };
  handleDeleteArticle = async () => {
    const { id } = this.state.deletingArticle || {};
    if (id) {
      const res = await deleteArticleApi(id);
      const { msg, code } = res || {};
      if (code !== 200) return;
      this.fetchArticleList();
      message.success(msg);
      this.setState({ deletingArticle: {} });
    }
  };
  setDeletingArticle = (deletingArticle) => {
    this.setState({ deletingArticle });
  };
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8, width: 300 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder="请输入名称关键字"
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置关键字
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({
      searchText: "",
    });
  };
  render() {
    const { articleList, loading, deletingArticle } = this.state;
    const columns = [
      {
        title: "序号",
        width: 80,
        dataIndex: "index",
        align: "center",
      },
      {
        title: "类型",
        dataIndex: "articleType",
        key: "articleType",
        width: 120,
        align: "center",
        filters: articleList.map((item) => {
          return {
            text: item.articleType,
            value: item.articleType,
          };
        }),
        filterSearch: true,
        onFilter: (value, record) => record.articleType.includes(value),
      },
      {
        title: "标题",
        dataIndex: "title",
        key: "title",
        ellipsis: true,
        textWrap: "word-break",
        align: "center",
        ...this.getColumnSearchProps("title"),
      },
      {
        title: "阅读数",
        dataIndex: "readCount",
        key: "readCount",
        width: 90,
        align: "center",
        sorter: (a, b) => a.readCount - b.readCount,
      },
      {
        title: "更新时间",
        width: 180,
        key: "updatedDate",
        dataIndex: "updatedDate",
        align: "center",
        sorter: (a, b) => Date.parse(a.updatedDate) - Date.parse(b.updatedDate),
      },
      {
        title: "是否展示",
        width: 110,
        key: "status",
        dataIndex: "status",
        align: "center",
        filters: [
          {
            text: "展示",
            value: 1,
          },
          {
            text: "隐藏",
            value: 0,
          },
        ],
        onFilter: (value, record) => record.status === value,
        render: (status, row) => {
          return (
            <Switch
              checked={status}
              loading={loading}
              onChange={() => this.handleToggleStatusClick(row)}
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
                onClick={() => this.handleEditArticleClick(row)}
              />
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                style={{
                  display: "inline-block",
                  marginLeft: "10px",
                }}
                onClick={() => this.handleDeleteArticleClick(row)}
              />
            </div>
          );
        },
      },
    ];
    return (
      <div className="article-list">
        <div className="content-container">
          <Table columns={columns} dataSource={articleList} rowKey="id" />
        </div>
        <DeleteModal
          deletingObj={deletingArticle}
          setDeletingObj={this.setDeletingArticle}
          onDelete={this.handleDeleteArticle}
        />
      </div>
    );
  }
}
