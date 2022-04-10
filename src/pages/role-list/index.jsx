import { Button, Table } from "antd";
import "./index.less";
import React, { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import DeleteModal from "@/components/DeleteModal";
import { getRolesApi } from "@/axios/api";
import {
  FormOutlined,
  DeleteOutlined,
  UnorderedListOutlined,
  KeyOutlined,
} from "@ant-design/icons";

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
export default function RoleList() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingRole, setDeletingRole] = useState({});
  const [updatingRole, setUpdatingRole] = useState({});
  const [roleList, setRoleList] = useState([]);
  const columns = [
    {
      title: "序号",
      width: 80,
      dataIndex: "index",
      align: "center",
    },
    {
      title: "角色名",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      textWrap: "word-break",
      width: 300,
      align: "center",
    },
    {
      title: "创建时间",
      width: 180,
      dataIndex: "createdDate",
      align: "center",
    },
    {
      title: "操作",
      key: "operation",
      align: "center",
      render: (row) => {
        return (
          <div className="btns">
            <Button
              icon={<KeyOutlined />}
              type="link"
              onClick={handleEditPermissionClick}
            >
              设置权限
            </Button>
            <Button
              icon={<UnorderedListOutlined />}
              type="link"
              onClick={handleEditMenuClick}
            >
              分配菜单
            </Button>
            <Button
              icon={<FormOutlined />}
              type="link"
              onClick={handleEditRoleClick}
            >
              编辑
            </Button>
            <Button
              icon={<DeleteOutlined />}
              type="link"
              onClick={handleDeleteRoleClick}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];
  const fetchRoles = async () => {
    const res = await getRolesApi();
    console.log({ res });
    const { code, data } = res || {};
    if (code !== 200) return;
    data.forEach((item, i) => (item.index = i + 1));
    setRoleList(data);
  };
  const handleEditRoleClick = (row) => {};
  const handleDeleteRoleClick = (row) => {};
  const handleEditMenuClick = (row) => {};
  const handleEditPermissionClick = (row) => {};
  const handleSubmit = () => {};
  const handleDeleteRole = () => {};
  useEffect(() => {
    fetchRoles();
  }, []);
  return (
    <div className="role-list">
      <div className="content-container">
        <Button type="primary" onClick={() => setIsShowModal(true)}>
          新增角色
        </Button>
        <Table columns={columns} dataSource={roleList} rowKey="id" />
      </div>
      <FormModal
        formConfig={formConfig}
        title={"角色"}
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        isSubmitting={isSubmitting}
        updatingObj={updatingRole}
        setUpdatingObj={setUpdatingRole}
        submitBtnCallBack={handleSubmit}
      >
          
      </FormModal>
      <DeleteModal
        deletingObj={deletingRole}
        setDeletingObj={setDeletingRole}
        onDelete={handleDeleteRole}
      />
    </div>
  );
}
