import React, { useEffect, useState } from "react";
import {
  getMenusApi,
  addMenuApi,
  updateMenuApi,
  deleteMenuApi,
  getIconsApi,
  getUserMenusApi,
} from "@/axios/api";
import "./index.less";
import {
  Table,
  Button,
  Form,
  Input,
  message,
  Select,
  Switch,
  InputNumber,
} from "antd";
import { UPDATE_MENUS } from "@/redux/actionTypes";
import {
  PlusCircleOutlined,
  FormOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import FormModal from "@/components/FormModal";
import DeleteModal from "@/components/DeleteModal";
import { useDispatch } from "react-redux";
const { Item } = Form;
const { Option } = Select;
const formConfig = {
  width: 500,
  layout: {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  },
  tailLayout: {
    wrapperCol: { offset: 4, span: 18 },
  },
};
const expandable = {
  defaultExpandAllRows: true,
  expandRowByClick: true,
  // expandIcon: ({ expanded, onExpand, record }) =>
  //   expanded ? (
  //     <RightOutlined onClick={(e) => onExpand(record, e)} />
  //   ) : (
  //     <DownOutlined onClick={(e) => onExpand(record, e)} />
  //   ),
};
export default function MenuList() {
  const dispatch = useDispatch();
  const [menus, setMenus] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [deletingMenu, setDeletingMenu] = useState({});
  const [updatingMenu, setUpdatingMenu] = useState({});
  const [icons, setIcons] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (_, row) => {
        const { name, icon } = row || {};
        return (
          <li>
            <i className={`iconfont ${icon.key}`}></i>
            <span style={{ marginLeft: "5px" }}>{name}</span>
          </li>
        );
      },
    },
    { title: "路径", align: "center", dataIndex: "key", key: "key" },
    {
      title: "组件目录",
      align: "center",
      dataIndex: "componentPath",
      key: "componentPath",
    },
    {
      title: "操作",
      key: "operation",
      width: 150,
      align: "center",
      render: (row) => {
        const { parentMenuId } = row || {};
        return (
          <div>
            {parentMenuId ? null : (
              <Button
                type="primary"
                icon={<PlusSquareOutlined />}
                onClick={() => handleAddSecondMenuClick(row)}
              />
            )}
            <Button
              type="primary"
              icon={<FormOutlined />}
              onClick={() => handleUpdateMenuClick(row)}
              style={{
                display: "inline-block",
                margin: parentMenuId ? "0 8px 0 40px" : "0 8px",
              }}
            />
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteMenuClick(row)}
            />
          </div>
        );
      },
    },
  ];
  const handleAddSecondMenuClick = (row) => {
    console.log({ row });
    setUpdatingMenu({ parentMenuId: row.id });
    setIsShowModal(true);
  };
  const handleUpdateMenuClick = (row) => {
    setUpdatingMenu(row);
    setIsShowModal(true);
  };
  const handleDeleteMenuClick = async (row) => {
    setDeletingMenu(row);
  };
  const handleDeleteMenu = async () => {
    const { id } = deletingMenu || {};
    if (!id) return message.error("参数格式错误，操作失败");
    const res = await deleteMenuApi(id);
    const { code, msg } = res || {};
    if (code === 200) {
      fetchMenus();
      message.success(msg);
      setDeletingMenu({});
    }
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
  const fetchIcons = async () => {
    const res = await getIconsApi();
    const { code, data } = res || {};
    if (code !== 200 && !data)
      return message.error("获取Icon图标失败，请刷新重试");
    setIcons(data);
  };
  const fetchMenus = async () => {
    const res = await getMenusApi();
    const { code, data } = res;
    console.log("menus-->", data);
    if (code !== 200 && !data) return;
    setMenus(data);
  };
  useEffect(() => {
    fetchMenus();
    fetchIcons();
  }, []);
  const handleSubmit = async (data) => {
    console.log({ data });
    if (typeof data.keepAlive === "boolean") {
      data.keepAlive = Number(data.keepAlive);
    }
    setIsSubmitting(true);
    const { id, parentMenuId } = updatingMenu;
    parentMenuId && (data.parentMenuId = parentMenuId);
    let res = null;
    if (id) {
      //修改
      res = await updateMenuApi(id, data);
      if (res.code === 200) {
        updateUserMenusList();
      }
    } else {
      //新增
      res = await addMenuApi(data);
    }
    setIsSubmitting(false);
    const { code, msg } = res || {};
    if (code === 200) {
      fetchMenus();
      message.success(msg);
      setIsShowModal(false);
    }
  };
  return (
    <div className="menu-list">
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => {
          setIsShowModal(true);
        }}
      >
        新增一级菜单
      </Button>
      <Table
        columns={columns}
        dataSource={menus}
        expandable={expandable}
        key={menus[0] && menus[0].id} //防止全部自动展开失败，因为defaultExpandAllRows只在首次渲染生效
        scroll={{ y: "calc(100vh - 160px)" }}
        pagination={false}
      />
      <FormModal
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        isSubmitting={isSubmitting}
        formConfig={formConfig}
        title={updatingMenu.parentMenuId ? "二级菜单" : "一级菜单"}
        updatingObj={updatingMenu}
        setUpdatingObj={setUpdatingMenu}
        submitBtnCallBack={handleSubmit}
        initialValues={{
          weight: 0,
          iconId: updatingMenu.icon && updatingMenu.icon.id,
        }}
      >
        <Item name="name" label="菜单名" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
        <Item name="key" label="路径" rules={[{ required: true }]}>
          <Input allowClear={true} />
        </Item>
        {updatingMenu.parentMenuId ? (
          <>
            <Item
              name="componentPath"
              label="组件目录"
              rules={[{ required: true }]}
            >
              <Input allowClear={true} />
            </Item>
            <Item
              label="是否缓存"
              name="keepAlive"
              rules={[{ required: true }]}
              valuePropName="checked"
              initialValue={false}
            >
              <Switch />
            </Item>
          </>
        ) : null}
        <Item name="iconId" label="图标" rules={[{ required: true }]}>
          <Select
            style={{ width: 220 }}
            placeholder="请选择图标"
            // showSearch
            // optionFilterProp="label"
            // filterOption={(input, option) => {
            //   const children = option.children.toString();
            //   console.log({ option });
            //   if (typeof children === "undefined") {
            //     return null;
            //   } else {
            //     return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            //   }
            // }}
          >
            {icons.map((item) => (
              <Option key={item.id}>
                <li>
                  <i className={`iconfont ${item.key}`}></i>
                  <span style={{ marginLeft: "5px" }}>{item.name}</span>
                </li>
              </Option>
            ))}
          </Select>
        </Item>
        <Item name="weight" label="权重" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Item>
      </FormModal>
      <DeleteModal
        deletingObj={deletingMenu}
        setDeletingObj={setDeletingMenu}
        onDelete={handleDeleteMenu}
      />
    </div>
  );
}
