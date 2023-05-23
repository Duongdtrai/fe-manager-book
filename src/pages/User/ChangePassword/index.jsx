import React, { useState } from 'react';
import { Form, Input, Button, notification, Image } from 'antd';
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { API } from "../../../configs";

const ChangePassword = () => {
  useDocumentTitle('Thay đổi mật khẩu');
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    API.changePasswordLP({
      password: values.password,
      newPassword: values.newPassword,
    }).then(() => {
      setLoading(false);
      notification["success"]({
        message: "Cập nhật mật khẩu thành công",
      });
    }).catch(err => {
      setLoading(false);
      notification["error"]({
        message: "Cập nhật mật khẩu không thành công"
      });
    });
  };
  
  return (
    <div 
      className='w-full h-screen flex justify-center items-center'
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      }}>
      <div className='w-4/5'>
        <h1 className='text-3xl text-center'>Thay đổi mật khẩu</h1>
        <Form
          onFinish={onFinish}
          layout="vertical"
          labelAlign="left"
          colon={false}
        >
          <Form.Item
            name="password"
            label="Mật khẩu cũ"
            rules={[{ required: true, message: "Vui lòng nhập trường này" },]}
            hasFeedback
          >
            <Input.Password placeholder='Mật khẩu cũ' />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập trường này" },]}
            hasFeedback
          >
            <Input.Password placeholder="Mật khẩu mới" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['password']}
            hasFeedback
            r rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) { return Promise.resolve(); }
                  return Promise.reject(new Error('Mật khẩu không trùng khớp. Vui lòng nhập lại'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
              loading={loading}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
   

  );
};

export default ChangePassword;