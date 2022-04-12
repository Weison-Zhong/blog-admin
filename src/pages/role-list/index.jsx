import { Button, Table, Tree, Drawer, message, Space } from "antd";
import "./index.less";
import React, { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import DeleteModal from "@/components/DeleteModal";
import {
  getRolesApi,
  getMenuPermissionListApi,
  updatePermissionForRoleApi,
} from "@/axios/api";
import { isArray } from "@/utils/is";
import {
  FormOutlined,
  DeleteOutlined,
  UnorderedListOutlined,
  KeyOutlined,
} from "@ant-design/icons";
let permissionTreeData = [];
let menuTreeData = [];
let flattenPermissions = [];
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
function getFlattenPermissions(menuPermissions) {
  const res = [];
  function travel(_permission) {
    _permission.forEach((permission) => {
      if (permission.apiId) {
        res.push(permission);
      }
      if (isArray(permission.children) && permission.children.length) {
        travel(permission.children);
      }
    });
  }
  travel(menuPermissions);
  return res;
}
export default function RoleList() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowPermissionDrawer, setIsShowPermissionDrawer] = useState(false);
  const [isShowMenuDrawer, setIsShowMenuDrawer] = useState(false);
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
              onClick={() => handleEditPermissionClick(row)}
            >
              设置权限
            </Button>
            <Button
              icon={<UnorderedListOutlined />}
              type="link"
              onClick={() => handleEditMenuClick(row)}
            >
              分配菜单
            </Button>
            <Button
              icon={<FormOutlined />}
              type="link"
              onClick={() => handleEditRoleClick(row)}
            >
              编辑
            </Button>
            <Button
              icon={<DeleteOutlined />}
              type="link"
              onClick={() => handleDeleteRoleClick(row)}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];
  //a

  const onCheck = (checkedKeys, info) => {
    /*     这种方式视图不改变
    updatingRole.permissionCheckedKeys = checkedKeys;
    setUpdatingRole(updatingRole)  */
    setUpdatingRole({
      ...updatingRole,
      permissionKeys: checkedKeys,
    });
  };
  //b
  const handlePermissionDrawerClose = () => {
    setIsShowPermissionDrawer(false);
    setUpdatingRole({});
  };
  const handleMenuDrawerClose = () => {
    setIsShowMenuDrawer(false);
    setUpdatingRole({});
  };
  const handleUpdateRoleMenu = () => {};
  const fetchRoles = async () => {
    const res = await getRolesApi();
    console.log({ res });
    const { code, data } = res || {};
    if (code !== 200) return;
    data.forEach((item, i) => (item.index = i + 1));
    setRoleList(data);
  };
  const fetchMenuPermissionList = async () => {
    const res = await getMenuPermissionListApi();

    const { code, data } = res || {};
    if (code !== 200) return;
    const { permissionList, menuList } = data || {};
    isArray(permissionList) && (permissionTreeData = permissionList);
    isArray(menuList) && (menuTreeData = menuList);
    console.log("a", menuList, permissionList);
    flattenPermissions = getFlattenPermissions(permissionList);
  };
  const handleUpdateRolePermission = async () => {
    const apiIds = [];
    updatingRole.permissionKeys.forEach((item) => {
      if (!item.includes("api/")) return; //排除一级菜单中的id
      const matchPermission = flattenPermissions.find(
        (permission) => permission.key === item
      );
      apiIds.push(matchPermission.apiId);
    });
    const data = {
      apiIds,
      roleId: updatingRole.id,
    };
    const res = await updatePermissionForRoleApi(data);
    const { code, msg } = res;
    if (code !== 200) return;
    fetchRoles();
    setIsShowPermissionDrawer(false);
    message.success(msg);
  };
  const handleEditRoleClick = (row) => {};
  const handleDeleteRoleClick = (row) => {};
  const handleEditMenuClick = (row) => {
    // const { permissions } = row || {};
    // if (isArray(permissions)) {
    //   row.permissionKeys = permissions.map((item) => item.key);
    // }
    setUpdatingRole(row);
    setIsShowMenuDrawer(true);
  };
  const handleEditPermissionClick = (row) => {
    const { permissions } = row || {};
    if (isArray(permissions)) {
      row.permissionKeys = permissions.map((item) => item.key);
    }
    setUpdatingRole(row);
    setIsShowPermissionDrawer(true);
  };
  const handleSubmit = () => {};
  const handleDeleteRole = () => {};
  useEffect(() => {
    fetchMenuPermissionList();
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
      ></FormModal>
      <DeleteModal
        deletingObj={deletingRole}
        setDeletingObj={setDeletingRole}
        onDelete={handleDeleteRole}
      />
      <Drawer
        title={`设置角色: ${updatingRole.name} 的权限`}
        placement="right"
        visible={isShowPermissionDrawer}
        onClose={handlePermissionDrawerClose}
        extra={
          <Space>
            <Button type="primary" onClick={handleUpdateRolePermission}>
              OK
            </Button>
          </Space>
        }
      >
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={updatingRole.permissionKeys}
          onCheck={onCheck}
          treeData={permissionTreeData}
        />
      </Drawer>
      <Drawer
        title={`设置角色: ${updatingRole.name} 的菜单`}
        placement="right"
        visible={isShowMenuDrawer}
        onClose={handleMenuDrawerClose}
        extra={
          <Space>
            <Button type="primary" onClick={handleUpdateRoleMenu}>
              OK
            </Button>
          </Space>
        }
      >
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={[]}
          onCheck={onCheck}
          treeData={menuTreeData}
        />
      </Drawer>
    </div>
  );
}