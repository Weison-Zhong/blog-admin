import React from "react";
import { Modal } from "antd";
export default function DeleteModal(props) {
  const { deletingObj, onDelete, setDeletingObj } = props;
  const { id, title, name } = deletingObj;
  return (
    <Modal
      visible={id}
      // confirmLoading={isDeleting}
      closable={false}
      onOk={onDelete}
      onCancel={() => {
        setDeletingObj({});
      }}
    >
      确定要删除: {name || title} 吗?
    </Modal>
  );
}
