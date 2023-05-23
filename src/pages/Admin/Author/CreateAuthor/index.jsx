import React, { useState } from 'react';
import { Form, Input, notification, Select, DatePicker, Button, Row, Col } from 'antd';
import UploadImage from '../../../../components/UploadImage';
import { useDocumentTitle } from "../../../../hooks/useDocumentTitle";
import { DATE_FORMAT } from "../../../../utils/constant";
import { API } from '../../../../configs';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import "./index.scss";

const { Option } = Select;
const CreateAuthor = () => {
  useDocumentTitle("Thêm tác giả");
  const [imageNew, setImageNew] = useState(null);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    let imageUrl = null;
    if (imageNew instanceof FormData) {
      try {
        const response = await API.uploadAvatarAuthorCMS(imageNew);
        imageUrl = response?.data?.data;
      } catch (error) {
        notification["error"]({
          message: "Thêm ảnh tác giả không thành công",
        });
      }
    }
    const dataAuthor = {
      fullName: values.fullName,
      description: values.description,
      birthday: moment(values.birthday).format(DATE_FORMAT),
      address: values.address,
      gender: values.gender,
      image: imageUrl
    };
    setLoading(true);
    API.createNewAuthor(dataAuthor).then(() => {
      notification["success"]({
        message: "Thêm tác giả thành công",
      });
      history.push("/admin/list-author");
    }).catch(() => {
      notification["error"]({
        message: "Thêm tác giả không thành công",
      });
    }).finally(() => {
      setLoading(false);
    });
  };

  const uploadFile = async (file) => {
    if (Object.keys(file).length === 0) {
      setImageNew(null);
    } else {
      const formData = new FormData();
      const emptyBlob = new Blob([""], { type: "text/plain" });
      if (file && file?.name) {
        formData.append("files", file, file.name);
      } else {
        formData.append("files", emptyBlob, "");
      }
      setImageNew(formData);
    }
  };

  return (
    <div className="create-author-container">
      <h1 className='text-3xl'>Thêm tác giả</h1>
      <Row gutter={[16, 16]}>
        <Col span={24} md={10}>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <Input className='w-full' placeholder='Họ và tên' />
            </Form.Item>
            <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <Select className='w-full' placeholder='Giới tính'>
                <Option value='Male'>Nam</Option>
                <Option value='Female'>Nữ</Option>
                <Option value='Other'>Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item name="birthday" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <DatePicker placeholder='Ngày sinh' format={DATE_FORMAT} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <Input className='w-full' placeholder='Địa chỉ' />
            </Form.Item>
            <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <Input.TextArea className='w-full' placeholder='Mô tả' rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
                Tạo mới tác giả
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24} md={14} className='md:!pb-11 flex justify-center items-center md:order-1 order-[-1]'>
          <UploadImage uploadFile={uploadFile} className="flex justify-center items-center" />
        </Col>
      </Row>
    </div>

  );
};

export default CreateAuthor;