import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Input, Button, notification } from 'antd';
import './style.scss';
import { useDocumentTitle } from "../../../../hooks/useDocumentTitle";
import { API } from '../../../../configs';
import UploadImage from '../../../../components/UploadImage';

const CreateBook = () => {
  const { categoryId } = useParams();
  useDocumentTitle(categoryId ? "Chi tiết danh mục" : "Thêm danh mục");
  const [form] = Form.useForm();
  const [disable, setDisable] = useState(categoryId ? true : false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (categoryId) {
      API.getDetailCategoryCMS(categoryId).then(response => {
        const data = response?.data?.data;
        setCategoryInfo(data);
        setImage(data?.avatar_category?.image || null);
        form.setFieldsValue({
          title: data.title,
        });
      }).finally(() => {
        console.clear();
      });
    }
    return () => {
      setCategoryInfo(null);
      setImage(null);
    };
  }, []);

  const handleSubmitEdit = async (values) => {
    setLoading(true);
    let imageUrl = null;
    if (file instanceof FormData) {
      try {
        let response = await API.uploadImageCategoryCMS(file);
        imageUrl = response?.data?.data;
      } catch (error) {
        notification["error"]({
          message: "Upload ảnh không thành công",
        });
      }
    }
    const newData = {
      image: imageUrl || categoryInfo.avatar_category,
      title: values.title,
    };
    API.updateCategory(categoryId, newData).then(() => {
      notification["success"]({
        message: "Sửa danh mục thành công",
      });
      history.push("/admin/list-category");
    }).catch(() => {
      notification["error"]({
        message: "Sửa danh mục không thành công",
      });
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleSubmitCreate = async (values) => {
    let imageUrl = null;
    setLoading(true);
    if (file instanceof FormData) {
      try {
        let response = await API.uploadImageCategoryCMS(file);
        imageUrl = response?.data?.data;
      } catch (error) {
        notification["error"]({
          message: "Upload ảnh không thành công",
        });
      }
    }
    const newData = {
      image: imageUrl,
      title: values.title,
    };
    API.createNewCategory(newData).then(() => {
      notification["success"]({
        message: "Thêm danh mục thành công",
      });
      history.push("/admin/list-category");
    }).catch(() => {
      notification["error"]({
        message: "Thêm danh mục không thành công",
      });
    }).finally(() => {
      setLoading(false);
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
    <div className="create-author-container">
      <h1 className='text-3xl'>{categoryId ? "Chi tiết danh mục" : "Thêm danh mục mới"}</h1>
      <UploadImage uploadFile={uploadFile} image={image} />
      <Form
        layout="vertical"
        labelAlign="left"
        colon={false}
        form={form}
        onFinish={(values) => categoryId ? handleSubmitEdit(values) : handleSubmitCreate(values)}
      >
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
          <Input className='w-full' placeholder='Mô tả' disabled={disable} />
        </Form.Item>
        {
          categoryId && disable
            ?
            <Button
              type="primary"
              htmlType="button"
              className="register-form-button"
              loading={loading}
              onClick={() => setDisable(!disable)}
            >
              Sửa danh mục
            </Button>
            : (
              !categoryId && !disable
                ?
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
                    Tạo mới danh mục
                  </Button>
                </Form.Item>
                : <Form.Item>
                  <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
                    Lưu danh mục
                  </Button>
                </Form.Item>
            )
        }
      </Form>
    </div>

  );
};

export default CreateBook;