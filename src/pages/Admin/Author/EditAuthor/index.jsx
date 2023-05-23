import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Button, notification, Row, Col } from 'antd';
import { useDocumentTitle } from "../../../../hooks/useDocumentTitle";
import moment from 'moment';
import UploadImage from '../../../../components/UploadImage';
import { DATE_FORMAT } from "../../../../utils/constant";
import { API } from '../../../../configs';
import { useHistory, useParams } from 'react-router-dom';
import "./index.scss";
const { Option } = Select;


const EditAuthor = () => {
  useDocumentTitle('Chỉnh sửa thông tin tác giả');
  const history = useHistory();
  const { authorId } = useParams();
  const [authorInfor, setAuthorInfor] = useState({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageNew, setImageNew] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    API.getDetailAuthor(authorId).then((response) => {
      const data = response?.data?.data;
      if (data.avatar) {
        setImage(data.avatar.image);
      }
      setAuthorInfor(data);
      form.setFieldsValue({
        ...data,
        birthday: response.data.birthday ? moment(response.data.birthday, DATE_FORMAT) : moment('01/01/2000', DATE_FORMAT)
      });
    }).catch(() => {
      notification["error"]({
        message: "Lấy thông tin tác giả không thành công",
      });
      history.push("/admin/list-author");
    }).finally(() => {
      console.clear();
    });
  }, []);

  const handleSubmit = async (values) => {
    let imageUrl = null;
    if (imageNew) {
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
      image: imageUrl || authorInfor.avatar
    };
    setLoading(true);
    API.updateAuthor(authorId, dataAuthor).then(() => {
      notification["success"]({
        message: "Sửa tác giả thành công",
      });
      setLoading(false);
      history.push("/admin/list-author");
    }).catch(() => {
      setLoading(false);
      notification["error"]({
        message: "Tạo nhân viên không thành công",
      });
    });
  };
  const uploadFile = async (file) => {
    const formData = new FormData();
    const emptyBlob = new Blob([""], { type: "image/jpeg" });
    if (file && file?.name) {
      formData.append("files", file, file.name);
    } else {
      formData.append("files", emptyBlob, "");
    }
    setImageNew(formData);
  };

  return (
    <div className="change-author-container">
      <h1 className='text-3xl'>Chỉnh sửa tác giả</h1>
      <Row gutter={[16, 16]}>
        <Col span={24} md={10}>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            labelAlign="left"
            colon={false}
            form={form}
          >

            <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <Input className='w-full' placeholder='Họ và tên' disabled={disabled} />
            </Form.Item>
            <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <Select className='w-full' placeholder='Giới tính' disabled={disabled}>
                <Option value='Male'>Nam</Option>
                <Option value='Female'>Nữ</Option>
                <Option value='Other'>Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item name="birthday" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <DatePicker placeholder='Ngày sinh' format={DATE_FORMAT} style={{ width: '100%' }} disabled={disabled} />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <Input className='w-full' placeholder='Địa chỉ' disabled={disabled} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} >
              <Input.TextArea className='w-full' placeholder='Mô tả' rows={4} disabled={disabled} />
            </Form.Item>
            {disabled ? <Button type="primary" htmlType="submit" className="register-form-button" onClick={() => setDisabled(false)}>
              Sửa tác giả
            </Button> :
              <Form.Item>
                <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
                  Lưu
                </Button>
              </Form.Item>
            }
          </Form>
        </Col>
        <Col span={24} md={14} className='md:!pb-11 flex justify-center items-center md:order-1 order-[-1]'>
          <UploadImage uploadFile={uploadFile} image={image} className="flex justify-center items-center" />
        </Col>
      </Row>
    </div>
  );
};

export default EditAuthor;