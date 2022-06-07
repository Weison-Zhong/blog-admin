import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Table,
  Form,
  Input,
  message,
  InputNumber,
  Switch,
  Select,
  Tag,
} from "antd";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  addDemoApi,
  deleteDemoApi,
  updateDemoApi,
  getDemosApi,
  toggleDemoStatusApi,
  getIconsApi,
} from "@/axios/api";
import { isArray } from "@/utils/is";
import "./index.less";
import ImgUpload from "@/components/ImgUpload";
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
let imgFile = null;
export default function DemoList() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingDemo, setUpdatingDemo] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingDemo, setDeletingDemo] = useState({});
  const [demoList, setDemoList] = useState([]);
  const [icons, setIcons] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const handleImgFileChange = useCallback((originFileObj) => {
    imgFile = originFileObj;
  }, []);
  const columns = [
    {
      title: "序号",
      width: 80,
      dataIndex: "index",
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
            onChange={() => handleToggleStatusClick(row)}
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
              onClick={() => handleEditArticleClick(row)}
            />
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              style={{
                display: "inline-block",
                marginLeft: "10px",
              }}
              onClick={() => handleDeleteArticleClick(row)}
            />
          </div>
        );
      },
    },
  ];
  function handleDeleteArticleClick(row) {
    setDeletingDemo(row);
  }
  function handleEditArticleClick(row) {
    setUpdatingDemo(row);
    setImageUrl(row.coverImgUrl);
    setIsShowModal(true);
  }
  async function handleToggleStatusClick(row) {
    setLoading(true);
    const res = await toggleDemoStatusApi(row.id);
    const { code, msg } = res || {};
    if (code === 200) {
      message.success(msg);
      fetchDemos();
    }
    setLoading(false);
  }
  async function fetchDemos() {
    const res = await getDemosApi();
    const { code, data } = res || {};
    if (code !== 200) return;
    data.forEach((item, i) => (item.index = i + 1));
    setDemoList(data);
  }
  async function fetchIcons() {
    const res = await getIconsApi();
    const { code, data } = res || {};
    if (code !== 200) return;
    setIcons(data);
  }
  //新增或修改Demo
  const handleSubmit = async (newDemo) => {
    setIsSubmitting(true);
    try {
      const { id } = updatingDemo || {};
      newDemo.status = Number(newDemo.status);
      const demoForm = new FormData();
      //遍历antd表单数据插入formdata
      for (let key in newDemo) {
        const val = newDemo[key];
        if (isArray(val)) {
          val.forEach((item) => demoForm.append(`${key}[]`, item));
        } else demoForm.append(key, newDemo[key]);
      }
      demoForm.append("coverImage", imgFile);
      let res = null;
      if (id) {
        //修改
        res = await updateDemoApi(id, demoForm);
      } else {
        //新增
        res = await addDemoApi(demoForm);
      }
      setIsSubmitting(false);
      const { code, msg } = res;
      if (code !== 200) return;
      imgFile = null;
      fetchDemos();
      setIsShowModal(false);
      message.success(msg);
    } catch (error) {
      message.error("保存失败，请重试");
      setIsSubmitting(false);
      console.log("Failed:", error);
    }
  };
  //删除Demo
  const handleDeleteDemo = useCallback(async () => {
    const { id } = deletingDemo || {};
    if (!id) return;
    const res = await deleteDemoApi(id);
    const { code, msg } = res || {};
    if (code !== 200) return;
    message.success(msg);
    setDeletingDemo({});
    fetchDemos();
  }, [deletingDemo]);
  const handleModalClose = () => {
    setUpdatingDemo({});
    setIsShowModal(false);
  };
  //初始化
  useEffect(() => {
    fetchDemos();
    fetchIcons();
    return () => {
      setDemoList({});
      setIcons({});
    };
  }, []);

  return (
    <div className="demo-list">
      <div className="content-container">
        <Button type="primary" onClick={() => setIsShowModal(true)}>
          添加Demo
        </Button>
        <Table
          columns={columns}
          dataSource={demoList}
          rowKey="id"
          scroll={{ y: "calc(100vh - 215px)" }}
          pagination={{
            showSizeChanger: true,
          }}
        />
      </div>
      {isShowModal && (
        <FormModal
          formConfig={formConfig}
          title="Demo"
          isSubmitting={isSubmitting}
          updatingObj={updatingDemo}
          submitBtnCallBack={handleSubmit}
          handleModalClose={handleModalClose}
          initialValues={{
            menuId: updatingDemo.belongMenu && updatingDemo.belongMenu.menuId,
            iconIds:
              updatingDemo.icons && updatingDemo.icons.map((item) => item.id),
          }}
        >
          <Item name="title" label="Demo名" rules={[{ required: true }]}>
            <Input allowClear={true} />
          </Item>
          <Item name="description" label="描述" rules={[{ required: true }]}>
            <Input.TextArea allowClear={true} />
          </Item>
          <Item
            name="relatedLink"
            label="github链接"
            rules={[{ required: true }]}
          >
            <Input allowClear={true} />
          </Item>
          <Item name="weight" label="权重" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Item>
          <Item
            label="状态"
            name="status"
            rules={[{ required: true }]}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="上架" unCheckedChildren="隐藏" />
          </Item>
          <Item label="Icon图标" name="iconIds" rules={[{ required: true }]}>
            <Select
              placeholder="请选择图标墙"
              mode="multiple"
              showArrow
              tagRender={TagRender}
              style={{ width: "100%" }}
              showSearch={false}
            >
              {icons.map((item) => {
                const { name, key } = item;
                return (
                  <Option key={item.id}>
                    {key.includes("icon") ? (
                      <li>
                        <i className={`iconfont ${item.key}`}></i>
                        <span style={{ marginLeft: "5px" }}>{item.name}</span>
                      </li>
                    ) : (
                      <li className="demo-icon-png">
                        <img src={key} alt="" />
                        <span>{name}</span>
                      </li>
                    )}
                  </Option>
                );
              })}
            </Select>
          </Item>
          <Item label="封面图" className="cover-img-upload">
            <ImgUpload
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              fileChange={handleImgFileChange}
            />
          </Item>
        </FormModal>
      )}
      <DeleteModal
        deletingObj={deletingDemo}
        setDeletingObj={setDeletingDemo}
        onDelete={handleDeleteDemo}
      />
    </div>
  );
}

function TagRender(props) {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      className="demo-tag-icon"
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
}
