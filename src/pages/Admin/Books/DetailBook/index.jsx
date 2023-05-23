import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Select, DatePicker, Button, notification, Row, Col } from 'antd';
import { useDocumentTitle } from "../../../../hooks/useDocumentTitle";
import { DATE_FORMAT } from "../../../../utils/constant";
import moment from 'moment';
import { API } from '../../../../configs';
import UploadImage from '../../../../components/UploadImage';
import "./style.scss";

const CreateBook = () => {
  const { bookId } = useParams();
  useDocumentTitle(bookId ? "Thông tin chi tiết sách" : "Thêm sách");
  const [form] = Form.useForm();
  const [disable, setDisable] = useState(bookId ? true : false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listAuthor, setListAuthor] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [image, setImage] = useState(null);
  const [bookInfor, setBookInfor] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (bookId) {
      API.getDetailBookCMS(bookId).then(response => {
        const data = response?.data?.data;
        setBookInfor(data);
        setImage(data?.avatar_book?.image);
        form.setFieldsValue({
          author: data?.author_book?.id,
          category: data?.category_book.id,
          description: data?.description,
          initialQuantity: data?.initialQuantity,
          numberPage: data?.numberPage,
          price: data?.price,
          title: data?.title,
          releaseDate: moment(data?.releaseDate, DATE_FORMAT)
        });
        API.getAllAuthorCMS(1, 10000, "").then(response => {
          setListAuthor(response.data.data.rows);
        }).finally(() => {
          console.clear();
        });
        API.getAllCategoryCMS(1, 10000, "").then(response => {
          setListCategory(response.data.data.rows);
        }).finally(() => {
          console.clear();
        });
      });
    } else {
      API.getAllAuthorCMS(1, 10000, "").then(response => {
        setListAuthor(response.data.data.rows);
      }).finally(() => {
        console.clear();
      });
      API.getAllCategoryCMS(1, 10000, "").then(response => {
        setListCategory(response.data.data.rows);
      }).finally(() => {
        console.clear();
      });
    }

  }, []);

  const handleSubmitEdit = async (values) => {
    setLoading(true);
    let imageUrl = null;
    if (file instanceof FormData) {
      try {
        let response = await API.upImageBook(file);
        imageUrl = response?.data?.data;
      } catch (error) {
        notification["error"]({
          message: "Upload ảnh không thành công",
        });
      }
    }
    const editData = {
      image: imageUrl || bookInfor.avatar_book,
      title: values.title,
      description: values.description,
      price: values.price,
      author: values.author,
      numberPage: values.numberPage,
      category: values.category,
      releaseDate: moment(values.releaseDate).format(DATE_FORMAT),
    };
    API.updateBook(editData, bookId).then(() => {
      notification["success"]({
        message: "Sửa sách thành công",
      });
      history.push("/admin/list-book");
    }).catch(() => {
      notification["error"]({
        message: "Sửa sách không thành công",
      });
    }).finally(() => {
      setLoading(false);
    });
  };


  const handleSubmitCreate = async (values) => {
    setLoading(true);
    let imageUrl = null;
    if (file instanceof FormData) {
      try {
        let response = await API.upImageBook(file);
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
      description: values.description,
      price: values.price,
      author: values.author,
      numberPage: values.numberPage,
      category: values.category,
      releaseDate: moment(values.releaseDate).format(DATE_FORMAT),
    };
    API.createNewBook(newData).then(() => {
      notification["success"]({
        message: "Thêm sách thành công",
      });
      history.push("/admin/list-book");
    }).catch(() => {
      notification["error"]({
        message: "Thêm sách không thành công",
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
      <h1 className='text-3xl'>{bookId ? "Chi tiết quyển sách" : "Thêm sách mới"}</h1>
      <Row gutter={[16, 16]}>
        <Col span={24} md={10}>
          <Form
            layout="vertical"
            labelAlign="left"
            colon={false}
            form={form}
            onFinish={(values) => bookId ? handleSubmitEdit(values) : handleSubmitCreate(values)}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
                  <Input className='w-full' placeholder='Tiêu đề' disabled={disable}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="author" label="Tác giả" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Thể loại"
                    options={listAuthor.map(author => ({ value: author.id, label: author.fullName }))}
                    disabled={disable}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea className='w-full' placeholder='Mô tả' rows={4} disabled={disable}/>
            </Form.Item>

            <Form.Item name="price" label="Giá tiền" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <InputNumber className='w-full' placeholder='Giá tiền' disabled={disable} />
            </Form.Item>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item name="releaseDate" label="Ngày phát hành" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
                  <DatePicker placeholder='Ngày phát hành' format={DATE_FORMAT} style={{ width: "100%" }} disabled={disable}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="numberPage" label="Số trang" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
                  <InputNumber className='w-full' placeholder='Số trang' disabled={disable} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="category" label="Thể loại" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <Select
                disabled={disable}
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                placeholder="Thể loại"
                options={listCategory.map(category => ({ value: category.id, label: category.title }))}
              />
            </Form.Item>
            {
              bookId && disable
                ?
                <Button
                  type="primary"
                  htmlType="button"
                  className="register-form-button"
                  loading={loading}
                  onClick={() => setDisable(!disable)}
                >
              Sửa sách
                </Button>
                : (
                  !bookId && !disable
                    ?
                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
                    Tạo mới sách
                      </Button>
                    </Form.Item>
                    : <Form.Item>
                      <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
                    Lưu sách
                      </Button>
                    </Form.Item>
                )
            }
          </Form>
        </Col>
        <Col span={24} md={14} className='pt-8 md:order-1 order-[-1]'>
          <UploadImage uploadFile={uploadFile} className="flex justify-center items-center" image={image} />
        </Col>
      </Row>
    </div>

  );
};

export default CreateBook;