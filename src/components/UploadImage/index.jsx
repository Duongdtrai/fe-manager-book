import React, { useEffect, useState }from 'react';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import {IMAGE_TYPES} from "../../utils/constant";


const getBase64 = (img, callback) => {
  if (img) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
};
  
const beforeUpload = (file) => {
  const isJpgOrPng =
      file.type === IMAGE_TYPES.jpeg ||
      file.type === IMAGE_TYPES.png ||
      file.type === IMAGE_TYPES.jpg ||
      file.type === IMAGE_TYPES.tif ||
      file.type === IMAGE_TYPES.heic;
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error("Image must smaller than 5MB!");
  }
};
const UploadImage = (props) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
  // eslint-disable-next-line react/prop-types
    setImageUrl(props.image);
  // eslint-disable-next-line react/prop-types
  }, [props.image]);

  const handleChange = (info) => {
    getBase64(info.file.originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  };
  const onRemove = () => {
    if (imageUrl) {
      setImageUrl("");
      // eslint-disable-next-line react/prop-types
      props.uploadFile({});
    }
  };
  const handleUpdateAvatar = (params) => {
    // eslint-disable-next-line react/prop-types
    props.uploadFile(params.file);
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <Upload
        accept="image/*"
        multiple={false}
        maxCount={1}
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        customRequest={handleUpdateAvatar}
        onRemove={onRemove}
        disabled={loading}
        style={{ width: 400 }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: '100%',
            }}
          />
        ) : (
          uploadButton
        )}
        {/* <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div> */}
      </Upload>
    </>
  );
};
export default UploadImage;