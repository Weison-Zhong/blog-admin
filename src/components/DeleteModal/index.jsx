import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
export default function DeleteModal(props) {
  const { deletingObj, deleteMenuApi, setDeletingObj } = props;
  const [isDeleting, setIsDeleting] = useState(false);
  const { id, title, name } = deletingObj;
  const handleDelete = async () => {
    setIsDeleting(true);
    if (!id) return message.error("参数格式错误，操作失败");
    const res = await deleteMenuApi(id);
    setIsDeleting(false);
    const { code } = res || {};
    if (code === 200) {
      setDeletingObj({});
    }
  };
  return (
    <Modal
      visible={id}
      confirmLoading={isDeleting}
      closable={false}
      onOk={handleDelete}
      onCancel={() => {
        setDeletingObj({});
      }}
    >
      确定要删除: {name || title} 吗?
    </Modal>
  );
}
