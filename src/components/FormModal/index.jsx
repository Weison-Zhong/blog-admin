import React, { useEffect, useRef } from "react";
import { Modal, Form, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const { Item } = Form;

function FormModal(props) {
  console.log("FormModal render");
  const formRef = useRef();
  const {
    isSubmitting,
    updatingObj,
    title,
    submitBtnCallBack,
    initialValues,
    formConfig,
    children,
    handleModalClose,
  } = props;
  const { width, layout, tailLayout } = formConfig || {};
  const resetFormData = () => formRef.current && formRef.current.resetFields();
  useEffect(() => {
    setTimeout(() => {
      formRef.current && formRef.current.setFieldsValue(updatingObj);
    }, 0);
  });
  return (
    <Modal
      title={(updatingObj.id ? "修改" : "新增") + title}
      visible={true}
      footer={null}
      onCancel={handleModalClose}
      width={width}
    >
      <Form
        {...layout}
        ref={formRef}
        initialValues={initialValues}
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

export default React.memo(FormModal);
