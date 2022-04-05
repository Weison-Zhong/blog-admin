import { useState } from "react";
import { Modal, Form, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const { Item } = Form;
let form = null;
const resetFormData = () => {
  form.resetFields();
};
export default function FormModal(props) {
  form = Form.useForm()[0];
  const { isShowModal, setIsShowModal, children, formConfig, width } = props;
  const { layout, tailLayout } = formConfig || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleOk = () => {
    setIsShowModal(false);
  };
  const handleAfterModalClose = () => {
    resetFormData();
  };
  const handleCancel = () => {
    setIsShowModal(false);
  };
  const handleOnFinish = () => {};
  return (
    <Modal
      title="Basic Modal"
      visible={isShowModal}
      onOk={handleOk}
      footer={null}
      afterClose={handleAfterModalClose}
      onCancel={handleCancel}
      width={width}
    >
      <Form {...layout} form={form} onFinish={handleOnFinish}>
        {children}
        <Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            icon={isSubmitting ? <LoadingOutlined /> : null}
          >
            {isSubmitting ? "提交中" : "提交"}
          </Button>
          <Button htmlType="button" onClick={resetFormData}>
            重置所有
          </Button>
        </Item>
      </Form>
    </Modal>
  );
}
