import React, { useState } from 'react';
import { Image } from 'antd';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import Logo from "../../assets/images/logo.png";
import { API } from '../../configs';
import { setAdminToken } from "../../redux/slice/AuthAdminSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LOGIN } from "../../utils/constant";
import { Redirect } from 'react-router-dom';
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const LoginAdmin = () => {
  useDocumentTitle('Login');
  const authAdmin = useSelector((state) => state.authAdmin);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading,setLoading] = useState(false);
  
  const onFinish = async (values) => {
    setLoading(true);
    API.loginAdmin({ email: values.email, password: values.password }).then((response) => {
      dispatch(setAdminToken(response.data.data));
      notification["success"]({
        message: "Đăng nhập thành công"
      });
      history.push("/admin");
    }).catch((error) => {
      notification["error"]({
        message: error.message
      });
    }).finally(() => {
      setLoading(false);
      console.clear();
    });
  };

  return (
    <>
      {/* {authAdmin?.accessTokenAdmin && authAdmin?.adminId ? (
        <Redirect to="/admin" />
      ) : ( */}
      <div className='w-full h-screen flex justify-center items-center sm:' >
        <div className='grid grid-cols-12'>
          <div className='sm:col-span-8 col-span-12'>
            <Image
              preview={false}
              width={400}
              src={Logo}
            />
          </div>
          <div className='sm:col-span-4 col-span-12'>
            <h1 className='text-center'>Đăng nhập</h1>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              // style={{
              //   maxWidth: 600,
              // }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập email',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập password!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Checkbox>Nhớ mật khẩu</Checkbox>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit" loading={loading}>
                    Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div style={{ position: "fixed", bottom: 10 }}>Verson 1.0</div>
      </div>
      {/* )} */}
    </>
  );
};

export default LoginAdmin;