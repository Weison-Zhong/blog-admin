import React, { useState } from "react";
import { message, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "./index.less";

function ImgUpload(props) {
  const { imageUrl, setImageUrl, fileChange } = props;
  const [loading, setLoading] = useState(false);
  const handleUpload = () => {
    setLoading(true);
  };
  //图片改变时，生成base64的url仅用于本地预览
  function handleChange(info) {
    const { originFileObj } = info.file;
    fileChange(originFileObj); //修改真实图片对象引用，当保存时转换为formdata传给后台
    getBase64(originFileObj, (imageUrl) => {
      setImageUrl(imageUrl);
      setLoading(false);
    });
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>点击上传图片</div>
    </div>
  );
  return (
    <Upload
      listType="picture"
      showUploadList={false}
      customRequest={handleUpload}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      className="img-upload-container"
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("仅可上传png或jpg,jpeg格式图片");
  }
  const isLt3M = file.size / 1024 / 1024 < 3;
  if (!isLt3M) {
    message.error("图片文件不能大于 3MB");
  }
  return isJpgOrPng && isLt3M;
}

export default React.memo(ImgUpload);
