import { Button, Table, message, Form, Input, Select } from "antd";
import "./index.less";
import React, { useEffect, useState, useCallback } from "react";
import FormModal from "@/components/FormModal";
import DeleteModal from "@/components/DeleteModal";
import { useSelector } from "react-redux";
import {
  getUsersApi,
  deleteUserApi,
  addUserApi,
  updateUserApi,
  getRolesApi,
} from "@/axios/api";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import ImgUpload from "@/components/ImgUpload";
import { useHistory } from "react-router-dom";
const { Item } = Form;
const { Option } = Select;
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
const pwdValidator = (_rule, value) => {
  if (!value) {
    return Promise.reject(new Error("请输入密码"));
  } else if (value.length > 32) {
    return Promise.reject(new Error("密码不能大于32位"));
  } else if (value.length < 3) {
    return Promise.reject(new Error("密码不能小于于3位"));
  }
  //  else if (!/^\w+$/.test(value)) {
  //   return Promise.reject(new Error("请检查密码格式"));
  // }
  return Promise.resolve();
};
let imgFile = null;
export default function UserList() {
  const history = useHistory();
  const userInfo = useSelector((state) => state.global.userInfo) || {};
  const [isShowModal, setIsShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingUser, setDeletingUser] = useState({});
  const [updatingUser, setUpdatingUser] = useState({});
  const [userList, setUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
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
      title: "头像",
      key: "avatar",
      width: 120,
      align: "center",
      render: (_, row) => {
        return <img className="avatar" src={row.avatarUrl} alt="" />;
      },
    },
    {
      title: "用户名",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      textWrap: "word-break",
      align: "center",
    },
    {
      title: "角色名",
      key: "userName",
      width: 230,
      align: "center",
      render: (_, row) => {
        const { roleName } = row.role || {};
        return roleName;
      },
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
      width: 130,
      align: "center",
      render: (row) => {
        return (
          <div>
            <Button
              type="primary"
              icon={<FormOutlined />}
              onClick={() => handleEditUserClick(row)}
            />
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              style={{
                display: "inline-block",
                marginLeft: "10px",
              }}
              onClick={() => handleDeleteUserClick(row)}
            />
          </div>
        );
      },
    },
  ];

  const fetchUsers = async () => {
    const res = await getUsersApi();
    const { code, data } = res || {};
    if (code !== 200) return;
    data.forEach((item, i) => (item.index = i + 1));
    setUserList(data);
  };
  const fetchRoles = async () => {
    const res = await getRolesApi();
    const { code, data } = res;
    if (code !== 200) return;
    setRoleList(data);
  };
  const handleEditUserClick = (row) => {
    setUpdatingUser(row);
    const { avatarUrl } = row || {};
    setImageUrl(avatarUrl);
    setIsShowModal(true);
  };
  const handleDeleteUserClick = (row) => {
    setDeletingUser(row);
  };

  const handleSubmit = async (newRole) => {
    const { id } = updatingUser;
    setIsSubmitting(true);
    const form = new FormData();
    for (let key in newRole) {
      form.append(key, newRole[key]);
    }
    form.append("avatarImg", imgFile);
    if (isSubmitting) return;
    setIsSubmitting(true);
    let res = null;
    if (id) {
      //修改
      res = await updateUserApi(id, form);
      //如果是修改当前登录用户的帐号信息，需跳转重新登录
      const { id: currentUserId } = userInfo;
      if (res.code === 200 && id === currentUserId) {
        message.success("修改当前登录用户信息成功，请重新登录");
        setTimeout(() => {
          history.push("/login");
        }, 300);
        return;
      }
    } else {
      //新增
      res = await addUserApi(form);
    }
    setIsSubmitting(false);
    const { code, msg } = res || {};
    if (code !== 200) return;
    message.success(msg);
    setIsShowModal(false);
    fetchUsers();
  };
  const handleDeleteRole = async () => {
    const { id } = deletingUser || {};
    if (!id) return;
    const res = await deleteUserApi(id);
    const { code, msg } = res || {};
    if (code !== 200) return;
    message.success(msg);
    setDeletingUser({});
    fetchUsers();
  };
  useEffect(() => {
    fetchUsers();
    fetchRoles();
    return () => {
      setUserList({});
      setRoleList({});
    };
  }, []);
  return (
    <div className="user-list">
      <div className="content-container">
        <Button type="primary" onClick={() => setIsShowModal(true)}>
          新增用户
        </Button>
        <Table
          columns={columns}
          dataSource={userList}
          rowKey="id"
          scroll={{ y: "calc(100vh - 210px)" }}
        />
      </div>
      <FormModal
        formConfig={formConfig}
        title={"用户"}
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        isSubmitting={isSubmitting}
        updatingObj={updatingUser}
        setUpdatingObj={setUpdatingUser}
        submitBtnCallBack={handleSubmit}
        initialValues={{
          roleId: updatingUser.role && updatingUser.role.roleId,
        }}
      >
        <Item name="name" label="用户名" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
        <Item
          name="password"
          label="密码"
          autoComplete="new-password"
          rules={[{ validator: pwdValidator, required: true }]}
        >
          <Input.Password allowClear={true} />
        </Item>
        <Item
          name="roleId"
          label="角色"
          rules={[{ required: true, message: "请选择角色" }]}
        >
          <Select
            showSearch
            placeholder="请选择角色"
            optionFilterProp="children"
            filterOption={(input, option) => {
              const children = option.children.toString();
              if (typeof children === "undefined") {
                return null;
              } else {
                return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }
            }}
          >
            {roleList.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label="头像" className="avatar-upload">
          <ImgUpload
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            fileChange={handleImgFileChange}
          />
        </Item>
      </FormModal>
      <DeleteModal
        deletingObj={deletingUser}
        setDeletingObj={setDeletingUser}
        onDelete={handleDeleteRole}
      />
    </div>
  );
}
