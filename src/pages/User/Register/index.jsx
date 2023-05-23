import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Select, notification, Image, Row, Col, InputNumber } from 'antd';
import { API } from "../../../configs";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import UploadImage from '../../../components/UploadImage';
import "./index.scss";
const { Option } = Select;

const RegisterPage = () => {
  const [file, setFile] = useState(null);
  useDocumentTitle("Đăng ký");
  const history = useHistory();

  const onFinish = async (values) => {
    let imageUrl = null;
    if (file instanceof FormData) {
      try {
        const response = await API.uploadImageUser(file);
        imageUrl = response?.data?.data;
      } catch (error) {
        notification["error"]({
          message: "Upload ảnh không thành công",
        });
      }
    }
    const dataRegister = {
      image: imageUrl,
      userName: values.userName,
      email: values.email,
      password: values.password,
      gender: values.gender,
      age: values.age,
      address: values.address,
      numberPhone: values.numberPhone,
    };
    API.registerUser(dataRegister).then(() => {
      notification["success"]({
        message: "Tạo tài khoản thành công",
      });
      history.push('/login');
    }).catch(() => {
      notification["error"]({
        message: "Tạo tài khoản không thành công",
      });
    });
  };

  const uploadFile = (fileUpload) => {
    const formData = new FormData();
    const emptyBlob = new Blob([""], { type: "text/plain" });
    if (fileUpload && fileUpload?.name) {
      formData.append("files", fileUpload, fileUpload.name);
    } else {
      formData.append("files", emptyBlob, "");
    }
    setFile(formData);
  };

  return (
    <div className='w-full h-screen flex justify-center items-center'
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      }}>
      <div className="register-user-container flex w-full justify-center items-center h-screen">
        <div className="w-4/5">
          <h1 style={{ textAlign: "center" }}>Đăng ký tài khoản</h1>
          <Row gutter={[16, 16]}>
            <Col span={24} md={10}>
              <Form
                name="normal_register"
                className="register-form"
                initialValues={{
                  prefix: '86',
                }}
                labelAlign="top"
                onFinish={onFinish}
                layout="vertical"
              >

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập trường này',
                    },
                    {
                      type: 'email',
                      message: 'Email không hợp lệ',
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập trường này',
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item
                  label="Họ và tên"
                  name="userName"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập trường này',
                    },
                  ]}
                >
                  <Input placeholder="Họ và tên" />
                </Form.Item>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      label="Giới tính"
                      name="gender"
                    >
                      <Select placeholder="Giới tính">
                        <Option value="male">Nam</Option>
                        <Option value="female">Nữ</Option>
                        <Option value="other">Khác</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Tuổi"
                      name="age"
                    >
                      <InputNumber placeholder='Tuổi' className='w-full' />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label="Số diện thoại"
                  name="numberPhone"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || value.length === 10) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Số điện thoại cần có 10 chữ số.'));
                      },
                    }),
                  ]}
                >
                  <Input style={{ width: '100%' }} placeholder="Số điện thoại" />
                </Form.Item>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                >
                  <Input style={{ width: '100%' }} placeholder="Địa chỉ" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="register-form-button">
                    Đăng ký tài khoản
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={24} md={14} className='pt-8 md:order-1 order-[-1]'>
              <UploadImage uploadFile={uploadFile} />
            </Col>
          </Row>
        </div>
      </div>
    </div>

  );
};

export default RegisterPage;
