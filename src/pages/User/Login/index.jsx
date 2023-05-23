import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, notification, Image } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { setUserToken } from '../../../redux/slice/AuthUserSlice';
import { API } from '../../../configs';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useState } from 'react';

const LoginPage = () => {
  useDocumentTitle("Đăng nhập");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    setLoading(true);
    API.loginUser({ email: values.email, password: values.password })
      .then((response) => {
        dispatch(setUserToken(response?.data?.data));
        notification["success"]({
          message: "Đăng nhập thành công",
        });
        history.push("/");
      }).catch(() => {
        notification["error"]({
          message: "Sai mật khẩu hoặc tên đăng nhập. Vui lòng nhập laị",
        });
      }).finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className='w-full h-screen flex justify-center items-center'
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      }}
    >
      <div className='w-[500px]'>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          labelAlign="top"
          layout="vertical"
        >
          <h1 style={{ textAlign: 'center' }}>Đăng nhập</h1>
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
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item className='text-center'>
            <Button type="primary" htmlType="submit" className="login-form-button mr-2 block w-full" loading={loading}>
              Đăng nhập
            </Button>
            <div className='font-semibold my-2'>Or</div>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button block w-full bg-lime-600"
              onClick={() => history.push("/register")}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
