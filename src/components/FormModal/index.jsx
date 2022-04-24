import { useEffect, useRef } from "react";
import { Modal, Form, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const { Item } = Form;

export default function FormModal(props) {
  const formRef = useRef();
  const {
    isShowModal,
    setIsShowModal,
    isSubmitting,
    updatingObj,
    setUpdatingObj,
    title,
    submitBtnCallBack,
    initialValues,
    formConfig,
    children,
  } = props;
  const { width, layout, tailLayout } = formConfig || {};
  const handleModalClose = () => {
    setUpdatingObj({});
    resetFormData();
  };
  const resetFormData = () => formRef.current && formRef.current.resetFields();
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
      destroyOnClose={true} //可防止Form的initialValues动态更新时延迟问题（读取到的是上次state）
      afterClose={handleModalClose}
      onCancel={() => {
        setIsShowModal(false);
      }}
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
