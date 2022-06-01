import { Button, Table, Tree, Drawer, message, Space, Form, Input } from "antd";
import "./index.less";
import React, { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import DeleteModal from "@/components/DeleteModal";
import { UPDATE_MENUS } from "@/redux/actionTypes";
import {
  getRolesApi,
  updateRoleApi,
  addRoleApi,
  deleteRoleApi,
  getUserMenusApi,
  updatePermissionForRoleApi,
  getMenusApi,
} from "@/axios/api";
import { isArray } from "@/utils/is";
import { getFlattenChildrenMenuList } from "@/utils/tools";
import {
  FormOutlined,
  DeleteOutlined,
  KeyOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
const { Item } = Form;
let flattenPermissions = [];
const formConfig = {
  width: 420,
  layout: {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  },
  tailLayout: {
    wrapperCol: { offset: 4, span: 20 },
  },
};
function getFlattenArray(array) {
  const res = [];
  function travel(_item) {
    _item.forEach((item) => {
      if (item.id) {
        res.push(item);
      }
      if (isArray(item.children) && item.children.length) {
        travel(item.children);
      }
    });
  }
  travel(array);
  return res;
}
export default function RoleList() {
  const dispatch = useDispatch();
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowPermissionDrawer, setIsShowPermissionDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingRole, setDeletingRole] = useState({});
  const [updatingRole, setUpdatingRole] = useState({});
  const [permissionTreeData, setPermissionTreeData] = useState({});
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

  const handlePermissionItemCheck = (checkedKeys) => {
    /*     这种方式视图不改变
    updatingRole.permissionCheckedKeys = checkedKeys;
    setUpdatingRole(updatingRole)  */
    setUpdatingRole({
      ...updatingRole,
      permissionKeys: checkedKeys,
    });
  };

  const handleDrawerClose = () => {
    setIsShowPermissionDrawer(false);
    setUpdatingRole({});
  };
  const updateUserMenusList = async () => {
    const res = await getUserMenusApi();
    const { code, data } = res || {};
    if (code !== 200) return;
    dispatch({
      type: UPDATE_MENUS,
      payload: data,
    });
  };
  const fetchRoles = async () => {
    const res = await getRolesApi();
    const { code, data } = res || {};
    if (code !== 200) return;
    // console.log("roles res --->", res);
    data.forEach((item, i) => (item.index = i + 1));
    setRoleList(data);
  };
  const handleUpdateRolePermission = async () => {
    setIsSubmitting(true);
    const apiIds = [];
    updatingRole.permissionKeys.forEach((item) => {
      if (!item.includes("api/")) return; //排除一级菜单中的id
      const matchPermission = flattenPermissions.find(
        (permission) => permission.key === item
      );
      apiIds.push(matchPermission.id);
    });
    const data = {
      apiIds,
      roleId: updatingRole.id,
    };
    const res = await updatePermissionForRoleApi(data);
    setIsSubmitting(false);
    const { code, msg } = res;
    if (code !== 200) return;
    fetchRoles();
    updateUserMenusList();
    setIsShowPermissionDrawer(false);
    message.success(msg);
  };

  const handleEditRoleClick = (row) => {
    setUpdatingRole(row);
    setIsShowModal(true);
  };
  const handleDeleteRoleClick = (row) => {
    setDeletingRole(row);
  };

  const handleEditPermissionClick = (row) => {
    const { permissions } = row || {};
    if (isArray(permissions)) {
      row.permissionKeys = permissions.map((item) => item.key);
    }
    setUpdatingRole(row);
    setIsShowPermissionDrawer(true);
  };
  const handleSubmit = async (newRole) => {
    const { id } = updatingRole;
    setIsSubmitting(true);
    let res = null;
    if (id) {
      //修改
      newRole.id = id;
      res = await updateRoleApi(newRole);
    } else {
      //新增
      res = await addRoleApi(newRole);
    }
    setIsSubmitting(false);
    const { code, msg } = res || {};
    if (code !== 200) return;
    message.success(msg);
    setIsShowModal(false);
    fetchRoles();
  };
  const handleDeleteRole = async () => {
    const { id } = deletingRole || {};
    if (!id) return;
    const res = await deleteRoleApi(id);
    const { code, msg } = res || {};
    if (code !== 200) return;
    message.success(msg);
    setDeletingRole({});
    fetchRoles();
  };
  //请求菜单列表，从结果中构造出权限树需要的数据结构
  const fetchMenus = async () => {
    const res = await getMenusApi();
    // console.log("menus --->", res);
    const { data, code } = res || {};
    if (code !== 200) return;
    const flattenChildMenus = getFlattenChildrenMenuList(data);
    const treeData = [];
    flattenChildMenus.forEach((item) => {
      const { key, name, apis } = item;
      treeData.push({
        title: name,
        key,
        children: apis,
      });
    });
    // console.log({treeData});
    setPermissionTreeData(treeData);
    flattenPermissions = getFlattenArray(treeData);
  };
  useEffect(() => {
    fetchRoles();
    fetchMenus();
    return () => {
      setPermissionTreeData({});
      setRoleList({});
    };
  }, []);
  return (
    <div className="role-list">
      <div className="content-container">
        <Button type="primary" onClick={() => setIsShowModal(true)}>
          新增角色
        </Button>
        <Table
          columns={columns}
          dataSource={roleList}
          rowKey="id"
          scroll={{ y: "calc(100vh - 160px)" }}
          pagination={false}
        />
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
        <Item name="name" label="角色名" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
      </FormModal>
      <DeleteModal
        deletingObj={deletingRole}
        setDeletingObj={setDeletingRole}
        onDelete={handleDeleteRole}
      />
      <Drawer
        title={`设置角色: ${updatingRole.name} 的权限`}
        placement="right"
        visible={isShowPermissionDrawer}
        onClose={handleDrawerClose}
        extra={
          <Space>
            <Button
              type="primary"
              onClick={handleUpdateRolePermission}
              icon={isSubmitting ? <LoadingOutlined /> : null}
            >
              {isSubmitting ? "提交中" : "提交"}
            </Button>
          </Space>
        }
      >
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={updatingRole.permissionKeys}
          onCheck={handlePermissionItemCheck}
          treeData={permissionTreeData}
        />
      </Drawer>
    </div>
  );
}
