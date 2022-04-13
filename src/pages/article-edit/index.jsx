import React, { useEffect, useState } from "react";
import "./index.less";
import Editor from "for-editor";
import { addArticleApi, getArticleTypesApi } from "@/axios/api";
import {
  Alert,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgUpload from "../../components/ImgUpload";
import { useHistory } from "react-router-dom";
import { queryURLParams } from "@/utils/tools";
const { Item } = Form;
const { Option } = Select;
let imgFile = null;
let index = 0;

const onFinish = (values) => {
  console.log({ values });
};
export default function ArticleEdit() {
  

  const formRef = React.createRef();
  const [form] = Form.useForm();
  const [articleContent, setArticleContent] = useState("");
  const [articleTypes, setArticleTypes] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newArticleType, setNewArticleType] = useState("");
  const history = useHistory();
  const fetchArticleTypes = async () => {
    const res = await getArticleTypesApi();
    const { data } = res;
    if (typeof data === "undefined") return;
    setArticleTypes(data);
  };
  const addNewArticleType = (e) => {
    e.preventDefault();
    setArticleTypes([...articleTypes, newArticleType || `New item ${index++}`]);
    setNewArticleType("");
  };
  //保存文章
  const handleSaveArticle = async () => {
    setIsSubmitting(true);
    try {
      const antdFormData = await formRef.current.validateFields();
      console.log("Validate Success:", antdFormData);
      if (antdFormData.status) {
        antdFormData.status = 1;
      } else {
        antdFormData.status = 0;
      }
      const articleForm = new FormData();
      //遍历antd表单数据插入formdata
      for (let key in antdFormData) {
        articleForm.append(key, antdFormData[key]);
      }
      articleForm.append("content", articleContent);
      articleForm.append("coverImage", imgFile);
      const res = await addArticleApi(articleForm);
      console.log({ res });
      setIsSubmitting(false);
      const { code } = res;
      if (code !== 200) return;
      message.success("新增文章成功，正前往列表页");
      setTimeout(() => {
        history.push("/article/list");
      }, 1500);
    } catch (error) {
      message.error("保存失败，请重试");
      setIsSubmitting(false);
      console.log("Failed:", error);
    }
  };

  useEffect(() => {
    fetchArticleTypes();
  }, []);

  return (
    <div className="article-edit">
      <Form form={form} ref={formRef} onFinish={onFinish} className="form">
        <Row gutter={2}>
          <Col span={16}>
            <Item name="title" label="标题" rules={[{ required: true }]}>
              <Input allowClear={true} />
            </Item>
            <Item name="relatedLink" label="链接" rules={[{ required: true }]}>
              <Input allowClear={true} />
            </Item>
            <Row gutter={2}>
              <Col span={12}>
                <Item
                  name="articleType"
                  label="类型"
                  rules={[{ required: true, message: "请选择类型" }]}
                >
                  <Select
                    style={{ width: 220 }}
                    placeholder="请选择文章类型"
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: "8px 0" }} />
                        <Space align="center" style={{ padding: "0 8px 4px" }}>
                          <Input
                            placeholder="新增文章类型"
                            value={newArticleType}
                            onChange={(e) => setNewArticleType(e.target.value)}
                          />
                          <Typography.Link
                            onClick={addNewArticleType}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <PlusOutlined />
                          </Typography.Link>
                        </Space>
                      </>
                    )}
                  >
                    {articleTypes.map((item) => (
                      <Option key={item}>{item}</Option>
                    ))}
                  </Select>
                </Item>
              </Col>
              <Col span={6}>
                <Item name="weight" label="权重" rules={[{ required: true }]}>
                  <InputNumber min={0} />
                </Item>
              </Col>
              <Col span={6}>
                <Item
                  label="状态"
                  name="status"
                  rules={[{ required: false }]}
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch
                    checkedChildren="上架"
                    unCheckedChildren="隐藏"
                    defaultChecked={true}
                  />
                </Item>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Item className="img-upload-container">
              <ImgUpload
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                fileChange={(originFileObj) => {
                  imgFile = originFileObj;
                }}
              />
            </Item>
          </Col>
        </Row>
      </Form>
      <Editor
        onSave={handleSaveArticle}
        subfield={true}
        preview={true}
        value={articleContent}
        onChange={(value) => setArticleContent(value)}
      />
      <Spin size="large" tip="保存中..." spinning={isSubmitting} />
    </div>
  );
}
