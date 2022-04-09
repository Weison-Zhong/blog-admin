import { useEffect, useState, useRef } from "react";
import { Modal, Form, Button, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const { Item } = Form;

export default function FormModal(props) {
  const form = Form.useForm()[0];
  const formRef = useRef();
  const {
    isShowModal,
    setIsShowModal,
    children,
    formConfig,
    updatingObj,
    setUpdatingObj,
    width,
    title,
    submitBtnCallBack,
  } = props;
  const { layout, tailLayout } = formConfig || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resetFormData = () => {
    form.resetFields();
  };
  const handleAfterModalClose = () => {
    setUpdatingObj({});
    resetFormData();
  };
  const handleCancel = () => {
    setIsShowModal(false);
  };
  useEffect(() => {
    setTimeout(() => {
      formRef.current && formRef.current.setFieldsValue(updatingObj);
    }, 0);
  });
  return (
    <Modal
      title={(updatingObj.id ? "修改" : "新增") + title}
      visible={isShowModal}
      footer={null}
      afterClose={handleAfterModalClose}
      onCancel={handleCancel}
      width={width}
    >
      <Form
        {...layout}
        form={form}
        ref={formRef}
        // onFinish={(data) => {
        //   submitBtnCallBack(data);
        // }}
        onFinish={submitBtnCallBack}
      >
        {children}
        <Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            icon={isSubmitting ? <LoadingOutlined /> : null}
          >
            {isSubmitting ? "提交中" : "提交"}
          </Button>
          <Button
            htmlType="button"
            onClick={resetFormData}
            style={{
              display: "inline-block",
              marginLeft: "10px",
            }}
          >
            重置所有
          </Button>
        </Item>
      </Form>
    </Modal>
  );
}
