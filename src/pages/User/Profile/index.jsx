import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, notification, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { API } from "../../../configs";
import UploadImage from '../../../components/UploadImage';
import { setUser , setIsLoading} from "../../../redux/slice/AuthUserSlice.js";

const Profile = () => {
  useDocumentTitle('Profile User');
  const { Option } = Select;
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const user = useSelector((state) => state.authUser.user);
  const is_loading = useSelector((state) => state.authUser.is_loading);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState({});
  
  useEffect(async () => {
    setImage(user?.avatar_user?.image || null);
    form.setFieldsValue({
      userName: user?.userName,
      gender: user?.gender,
      age: user?.age,
      address: user?.address,
      numberPhone: user?.numberPhone,
    });
  }, [is_loading]);

  const onFinish = async (values) => {
    setLoading(true);
    let imageUrl = null;
    if (file instanceof FormData) {
      try {
        const response = await API.uploadImageUser(file);
        imageUrl = response?.data?.data;
      } catch (error) {
        notification["error"]({
          message: "Cập nhật ảnh không thành công",
        });
      }
    }
    const dataEdit = {
      image: imageUrl || user.avatar_user,
      userName: values.userName,
      gender: values.gender,
      age: values.age,
      address: values.address,
      numberPhone: values.numberPhone
    };
    
    API.updateInforUser(dataEdit).then(() => {
      notification["success"]({
        message: "Cập nhật thông tin thành công",
      });
      dispatch(setUser(dataEdit));
      dispatch(setIsLoading());
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      notification["error"]({
        message: "Cập nhật thông tin không thành công",
      });
    }).finally(() => {
      console.clear();
    });

  };

  const uploadFile = async (fileUpload) => {
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
      }}
    >
      <div className="w-4/5">
        <h1 className='text-3xl text-center'>Thông tin tài khoản</h1>
        <div className='w-full flex justify-center items-center'>
          <UploadImage uploadFile={uploadFile} image={image} />
        </div>
        <Form
          onFinish={onFinish}
          layout="vertical"
          labelAlign="left"
          colon={false}
          form={form}
        >
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
            <Input placeholder="Họ tên" disabled={disabled} />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gender"
          >
            <Select placeholder="Giới tính" disabled={disabled}>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="age" label="Tuổi" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
            <InputNumber className='w-full' placeholder='Tuổi' disabled={disabled} />
          </Form.Item>
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
            <Input style={{ width: '100%' }} placeholder="Số điện thoại" disabled={disabled} />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
          >
            <Input style={{ width: '100%' }} placeholder="Địa chỉ" disabled={disabled} />
          </Form.Item>

          {disabled ?
            <Button 
              type="primary" 
              htmlType="submit" 
              className="register-form-button float-right !rounded-none"
              onClick={() => setDisabled(false)} >
              Sửa thông tin
            </Button>
            :
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="register-form-button float-right !rounded-none" 
                loading={loading} >
                Cập nhật
              </Button>
            </Form.Item>}
        </Form>
      </div>
    </div>

  );
};

export default Profile;