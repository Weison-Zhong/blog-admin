import React, { useEffect, useRef, useState } from "react";
import { Button, Table, Modal, Form, Input, message, Select } from "antd";
import {
  FormOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  addApiApi,
  deleteApiApi,
  updateApiApi,
  getApisApi,
  getMenusApi,
} from "../../axios/api";
import { isArray } from "@/utils/is";
import { useDispatch } from "react-redux";
const { Item } = Form;
const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

export default function PermissionManage() {
  const formRef = useRef();
  const [isShowAddUpdatePermissionModal, setIsShowAddUpdatePermissionModal] =
    useState(false);
  const [updatingPermission, setUpdatingPermission] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingPermission, setIsDeletingRole] = useState(false);
  const [deletingPermission, setDeletingRole] = useState({});
  const [form] = Form.useForm();
  const [permissionList, setPermissionList] = useState([]);
  const [flattenMenuList, setFlattenMenuList] = useState([]);
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center",
    },
    {
      title: "接口名",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      textWrap: "word-break",
      width: 150,
      align: "center",
    },
    {
      title: "路径",
      dataIndex: "key",
      key: "key",
      ellipsis: true,
      textWrap: "word-break",
      width: 100,
      align: "center",
    },
    {
      title: "创建时间",
      width: 200,
      dataIndex: "createdDate",
      align: "center",
    },
    {
      title: "说明",
      dataIndex: "description",
      align: "center",
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
              onClick={() => handleEditPermissionClick(row)}
            />
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              style={{
                display: "inline-block",
                marginLeft: "10px",
              }}
              onClick={() => handleDeleteRoleClick(row)}
            />
          </div>
        );
      },
    },
  ];
  function handleDeleteRoleClick(row) {
    setDeletingRole(row);
  }
  async function fetchPermissions() {
    const res = await getApisApi();
    //若axios没有加全局拦截器，那么走不到这里，控制台会报Uncaught (in promise) Error错误，但是如果上面await那里加了catch则可以继续执行，res是undefined;
    //若axios的interceptors.response.use()第二个参数有处理，则返回我们return的东西。
    const { code, data } = res || {};
    if (code !== 200) return;
    data.forEach((item, i) => (item.index = i + 1));
    setPermissionList(data);
  }
  async function fetchMenus() {
    const res = await getMenusApi();
    const { code, data } = res || {};
    if (code !== 200) return;
    function travel(_menus) {
      _menus.forEach((menu) => {
        flattenMenus.push(menu);
        if (isArray(menu.children) && menu.children.length) {
          travel(menu.children);
        }
      });
    }
    const flattenMenus = [];
    travel(data);
    console.log({ flattenMenus });
    setFlattenMenuList(flattenMenus);
  }
  //新增或修改权限API
  const addOrUpdatePermission = async (newPermission) => {
    const { id } = updatingPermission;
    setIsSubmitting(true);
    let res = null;
    if (id) {
      //修改权限
      newPermission.id = id;
      res = await updateApiApi(newPermission);
    } else {
      //新增权限
      res = await addApiApi(newPermission);
    }
    setIsSubmitting(false);
    const { code, msg } = res || {};
    if (code !== 200) return;
    message.success(msg);
    setIsShowAddUpdatePermissionModal(false);
    fetchPermissions();
  };
  //删除权限API
  async function handleDeletePermission() {
    setIsDeletingRole(true);
    const { id } = deletingPermission || {};
    if (!id) return;
    const res = await deleteApiApi(id);
    const { code, msg } = res || {};
    setIsDeletingRole(false);
    if (code !== 200) return;
    message.success(msg);
    setDeletingRole({});
    fetchPermissions();
  }
  //修改权限按钮
  function handleEditPermissionClick(row) {
    setUpdatingPermission(row);
    setIsShowAddUpdatePermissionModal(true);
    //下面不放异步的话或，首次进入点击编辑会报错（因为读取formRef时form dom未生成,猜测是antd的Modal也是异步生成）
    setTimeout(() => {
      formRef.current.setFieldsValue(row);
    }, 0);
  }
  const handleModalClose = () => {
    form.resetFields();
    setUpdatingPermission({});
  };
  const handleCancel = () => {
    setIsShowAddUpdatePermissionModal(false);
  };
  const onReset = () => {
    form.resetFields();
  };
  //初始化
  useEffect(() => {
    fetchPermissions();
    fetchMenus();
  }, []);

  return (
    <div className="permission-manage">
      <div className="content-container">
        <Button
          type="primary"
          onClick={() => setIsShowAddUpdatePermissionModal(true)}
        >
          添加权限
        </Button>
        <Table columns={columns} dataSource={permissionList} rowKey="id" />
      </div>
      <Modal
        title={updatingPermission.id ? "修改权限" : "添加权限"}
        visible={isShowAddUpdatePermissionModal}
        onCancel={handleCancel}
        footer={null}
        width={550}
        afterClose={handleModalClose}
      >
        <Form
          {...layout}
          form={form}
          ref={formRef}
          name="control-hooks"
          onFinish={addOrUpdatePermission}
          className="form-container"
          initialValues={{}}
        >
          <Item name="title" label="权限名" rules={[{ required: true }]}>
            <Input allowClear={true} />
          </Item>
          <Item name="key" label="路径" rules={[{ required: true }]}>
            <Input allowClear={true} />
          </Item>
          <Item name="description" label="说明" rules={[{ required: true }]}>
            <Input.TextArea allowClear={true} />
          </Item>
          <Item name="menuId" label="所属菜单" rules={[{ required: false }]}>
            <Select style={{ width: 220 }} placeholder="请选择所属菜单">
              {flattenMenuList.map((item) => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Item>
          <Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              icon={isSubmitting ? <LoadingOutlined /> : null}
            >
              {isSubmitting ? "提交中" : "提交"}
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置所有
            </Button>
          </Item>
        </Form>
      </Modal>
      <Modal
        visible={deletingPermission.id ? true : false}
        confirmLoading={isDeletingPermission}
        closable={false}
        onOk={() => handleDeletePermission()}
        onCancel={() => setDeletingRole({})}
      >
        确定要删除权限: {deletingPermission.name} 吗?
      </Modal>
    </div>
  );
}
