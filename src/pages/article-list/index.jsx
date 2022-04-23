import React, { Component } from "react";
import { Button, Table, message, Switch } from "antd";
import "./index.less";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getArticlesApi,
  toggleArticleStatusApi,
  deleteArticleApi,
} from "@/axios/api";
import { isArray } from "@/utils/is";
import DeleteModal from "@/components/DeleteModal";
export default class ArticleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleList: [],
      loading: false,
      deletingArticle: {},
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
        title: "阅读数",
        dataIndex: "readCount",
        key: "readCount",
        width: 80,
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
