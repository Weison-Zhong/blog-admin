import React, { Component } from "react";
import { Button, Table, message, Switch, Input, Space, Spin } from "antd";
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
  getArticleTypesApi,
  deleteArticleApi,
  updateArticleWeightApi,
} from "@/axios/api";
import { isArray } from "@/utils/is";
import DeleteModal from "@/components/DeleteModal";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";
import { arrayMoveImmutable } from "array-move";
let searchInput = null;
const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));
const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);
export default class ArticleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleList: [],
      articleTypes: [],
      loading: false,
      deletingArticle: {},
      searchText: "",
      searchedColumn: "",
      isLoading: false,
    };
  }
  componentDidMount() {
    this.fetchArticleList();
    this.fetchArticleTypes();
  }
  onSortEnd = async (data) => {
    const { articleList, isLoading } = this.state;
    const { oldIndex, newIndex } = data;
    const diff = oldIndex - newIndex;
    if (!diff || isLoading) return;
    this.setState({ isLoading: true });
    const matchArticle = articleList[oldIndex];
    const { weight, id } = matchArticle || {};
    // const newData = arrayMoveImmutable(
    //   [].concat(articleList),
    //   oldIndex,
    //   newIndex
    // ).filter((el) => !!el);
    // this.setState({ articleList: newData });
    const newWeight = weight + diff;
    const res = await updateArticleWeightApi(id, { newWeight });
    const { code } = res || {};
    if (code === 200) {
      this.fetchArticleList();
      message.success("排序成功");
    } else message.error("重新排序失败，请重试");
    this.setState({ isLoading: false });
  };

  DraggableContainer = (props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { articleList } = this.state;
    const index = articleList.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };
  fetchArticleList = async () => {
    const params = {
      PageNumber: 1,
      PageSize: 999,
      // ArticleType: "",
      // status: "",
    };
    const res = await getArticlesApi(params);
    const { code, data } = res || {};
    if (code !== 200) return;
    const { articles } = data || {};
    if (isArray(articles)) {
      articles.forEach((item, i) => (item.index = i + 1));
      this.setState({ articleList: articles });
    }
  };
  fetchArticleTypes = async () => {
    const res = await getArticleTypesApi();
    const { data } = res;
    if (typeof data === "undefined") return;
    this.setState({
      articleTypes: data,
    });
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
  //标题关键字搜索代码段 bigin
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
  //标题关键字搜索代码段 end
  render() {
    const { articleList, loading, deletingArticle, articleTypes, isLoading } =
      this.state;
    const columns = [
      {
        title: "排序",
        dataIndex: "sort",
        width: 60,
        className: "drag-visible",
        align: "center",
        render: () => <DragHandle />,
      },
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
        filters: articleTypes.map((item) => {
          return {
            text: item,
            value: item,
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
        width: 160,
        key: "updatedDate",
        dataIndex: "updatedDate",
        align: "center",
        sorter: (a, b) => Date.parse(a.updatedDate) - Date.parse(b.updatedDate),
      },
      {
        title: "展示",
        width: 80,
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
          <Table
            columns={columns}
            dataSource={articleList}
            // rowKey="id"
            rowKey="index"
            components={{
              body: {
                wrapper: this.DraggableContainer,
                row: this.DraggableBodyRow,
              },
            }}
          />
        </div>
        <DeleteModal
          deletingObj={deletingArticle}
          setDeletingObj={this.setDeletingArticle}
          onDelete={this.handleDeleteArticle}
        />
        <Spin
          delay={800}
          size="large"
          tip="重新排序中···"
          spinning={isLoading}
        />
      </div>
    );
  }
}
