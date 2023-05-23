import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { EyeOutlined } from '@ant-design/icons';
import { Col, Row, Image, Button, notification, InputNumber, Space, Form, Input, Rate, Dropdown } from 'antd';
import { API } from '../../../configs';
import BookDefault from "../../../assets/images/bookDefault.png";
import UserDefault from "../../../assets/images/user-default.png";
import { FiTruck } from "react-icons/fi";
import { AiFillQuestionCircle } from "react-icons/ai";
import { SlShareAlt } from "react-icons/sl";
import "./index.scss";
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import LoadingComponent from '../../../components/LoadingComponent';
import { changeTypePrice } from '../../../utils/constant';
import { setIsLoading } from '../../../redux/slice/AuthUserSlice';

const DetailBook = () => {
  useDocumentTitle('Chi tiết quyển sách');
  const [loading, setLoading] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);

  const [bookDetails, setBookDetails] = useState([]);
  const [listComments, setListComments] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [dataBuy, setDataBuy] = useState({
    quantity: 0,
  });
  const userId = useSelector((state) => state.authUser.userId);
  const is_login = useSelector((state) => state.authUser.is_loading);
  const { bookId } = useParams();
  const history = useHistory();
  const [commentDelete, setCommentDelete] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    API.getDetailBookLP(bookId).then((response) => {
      setBookDetails(response?.data?.data);
      setListComments(response?.data?.data?.commentUser);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      notification["error"]({
        message: "Lấy chi tiết sách không thành công",
      });
    }).finally(() => {
      console.clear();
    });
  }, [refresh]);

  const onFinishComment = async (values) => {
    const data = {
      bookId: Number(bookId),
      comment: values.comment,
      star: values.star
    };
    setLoadingComment(true);
    API.createCommentBook(data).then(() => {
      notification["success"]({
        message: "Bạn đã đánh giá thành công",
      });
      API.getDetailBookLP(bookId).then((response) => {
        setBookDetails(response?.data?.data);
        setListComments(response?.data?.data?.commentUser);
      });
    }).catch(() => {
      notification["error"]({
        message: "Thêm đánh giá không thành công",
      });
    }).finally(() => {
      setLoadingComment(false);
    });
  };

  const handleAddCart = () => {
    if (!is_login) {
      notification["error"]({
        message: "Bạn cần đăng nhập để có thể thêm được sản phẩm vào giỏ hàng",
      });
      return;
    }
    if (dataBuy.quantity === 0) {
      notification["warning"]({
        message: "Vui lòng chọn số lượng"
      });
      return;
    }
    setLoadingAdd(false);
    API.createNewCart({
      bookId: Number(bookId),
      status: "in-cart",
      note: null,
      address: "",
      numberPhone: "",
      quantity: dataBuy.quantity
    }).then(() => {
      setLoadingAdd(false);
      dispatch(setIsLoading());
      notification["success"]({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
      });
    }).catch(() => {
      notification["error"]({
        message: "Thêm sản phẩm vào giỏ hàng không thành công",
      });
    }).finally(() => {
      setLoadingAdd(false);
    });
  };

  const handleBuyCart = () => {
    if (!is_login) {
      notification["error"]({
        message: "Bạn cần đăng nhập để có thể thêm được sản phẩm vào giỏ hàng",
      });
      return;
    }
    if (dataBuy.quantity === 0) {
      notification["warning"]({
        message: "Vui lòng chọn số lượng"
      });
      return;
    }
    setLoadingAdd(false);
    API.createNewCart({
      bookId: Number(bookId),
      status: "in-cart",
      note: null,
      address: "",
      numberPhone: "",
      quantity: dataBuy.quantity
    }).then(() => {
      setLoadingAdd(false);
      dispatch(setIsLoading());
      notification["success"]({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
      });
      history.push("/cart");
    }).catch(() => {
      notification["error"]({
        message: "Thêm sản phẩm vào giỏ hàng không thành công",
      });
    }).finally(() => {
      setLoadingAdd(false);
    });
  };

  const items = [
    {
      label: 'Xóa',
      key: '1',
    },
  ];
  const handleButtonClick = (e) => {
    API.deleteCommentBook(commentDelete?.id).then(() => {
      notification["success"]({
        message: "Xóa đánh giá thành công",
      });
      API.getDetailBookLP(bookId).then((response) => {
        setBookDetails(response?.data?.data);
        setListComments(response?.data?.data?.commentUser);
      });
    }).catch(() => {
      notification["error"]({
        message: "Xóa đánh giá không thành công",
      });
    });
  };
  const menuProps = {
    items,
    onClick: handleButtonClick,
  };

  return (
    <>
      {loading ? <LoadingComponent /> :
        <div className='details-book'>
          <Image
            src="https://static.vecteezy.com/system/resources/previews/002/294/880/original/reading-book-web-banner-design-student-reading-book-on-stack-of-book-to-get-inspiration-online-education-digital-classroom-e-learning-concept-header-or-footer-banner-free-vector.jpg"
            className='w-full'
            preview={false}
          />
          <div className="mx-10 sm:mx-32">
            <Row gutter={[16, 16]} className='mt-6'>
              <Col sm={8} span={24} >
                <Image
                  style={{ width: "100%", height: "auto", objectFit: "contain" }}
                  src={bookDetails?.avatar_book?.image || BookDefault}
                  preview={{ mask: <EyeOutlined className='!text-lg' /> }}
                />

              </Col>
              <Col sm={16} span={24} style={{ width: "100%" }}>
                <h3>{bookDetails.title}</h3>
                <Row gutter={[16, 16]}>
                  <Col span={8} sm={4} className="font-medium text-base">Tên sách:</Col>
                  <Col span={16} sm={18} className="text-base">{bookDetails.title}</Col>
                  <Col span={8} sm={4} className="font-medium text-base">Tác giả:</Col>
                  <Col span={16} sm={18} className="text-base">{bookDetails?.author_book
                    ?.fullName}</Col>
                  <Col span={8} sm={4} className="font-medium text-base">Giá tiền:</Col>
                  <Col span={16} sm={18} className="text-base">{changeTypePrice(bookDetails?.price)}</Col>
                  <Col sm={24} className="block sm:flex gap-2 items-center" >
                    <div className="mb-2">
                      <InputNumber
                        className='!rounded-none'
                        size="large"
                        defaultValue={0}
                        min={1}
                        onChange={(value) => setDataBuy({ ...dataBuy, quantity: value })}
                      />
                    </div>
                    <div className="mb-2">
                      <Button
                        size="large"
                        type="primary"
                        className="bg-[#f76b6a] text-white !rounded-none"
                        onClick={handleAddCart}
                        loading={loadingAdd}
                      >
                        Thêm vào giỏ hàng
                      </Button>
                    </div>
                    <div className="mb-2">
                      <Button
                        type="primary"
                        size="large"
                        className="bg-[#79b530] text-white !rounded-none"
                        loading={loadingBuy}
                        onClick={handleBuyCart}
                      >
                        Mua ngay
                      </Button>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className='flex items-center mb-1'>
                      <SlShareAlt className='mr-2' />
                      <div>Giao Hàng & Hoàn Trả</div>
                    </div>
                    <div className='flex items-center mb-1'>
                      <AiFillQuestionCircle className='mr-2' />
                      <div>
                        Hỏi Chúng tôi
                      </div>
                    </div>
                    <div className='flex items-center mb-1'>
                      <FiTruck className='mr-2' />
                      <div>
                        Dự kiến giao Hàng:&nbsp; 3 - 7 ngày
                      </div>
                    </div>
                  </Col>
                </Row>
                <Image
                  src="https://tiemsachre.com/wp-content/uploads/2022/03/9-hinh-thuc-thanh-toan-e1654150616899.png"
                  preview={false}
                />
              </Col>
            </Row>
            <h1 className='mt-2 !mb-1'>MÔ TẢ SẢN PHẨM</h1>
            {
              bookDetails?.description && bookDetails?.description.split("\n").map((item, index) => <div key={index}>{item}</div>)
            }
            <h1 className='mt-2'>ĐÁNH GIÁ SẢN PHẨM</h1>
            <Form name="review-form" onFinish={onFinishComment} className='form-comment'>
              <Form.Item name="star" label="Đánh giá" labelCol={{ style: { fontWeight: 'bold' } }}>
                <Rate value={2} />
              </Form.Item>
              <div className='font-bold mb-2'>Nhận xét <span className='text-red-600'>*</span></div>
              <Form.Item
                name="comment"
                label=""
                labelCol={{ style: { fontWeight: 'bold' } }}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập nhận xét!',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Nhận xét sản phẩm" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className='bg-[#f76b6a] !rounded-none mt-2'
                  loading={loadingComment}
                >
                  Gửi đi
                </Button>
              </Form.Item>
            </Form>

            <h1 className='mt-2'>BÌNH LUẬN</h1>
            <Row>
              {
                listComments.map((item, index) => {
                  return (
                    <Col key={index} span={24}>
                      <Row gutter={[16, 8]}>
                        <Col span={24}>
                          <div className='flex justify-between'>
                            <Space>
                              <Image
                                preview={false}
                                src={item?.user?.avatar_user?.image || UserDefault}
                                style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "contain" }}
                              />
                              <div>
                                <div>{item?.user.userName || item?.user?.email}</div>
                                <Rate value={item?.star} disabled />
                              </div>

                            </Space>
                            {
                              (Number(userId) === item?.user?.id) && <div>
                                <Dropdown menu={menuProps}>
                                  <div className="cursor-pointer text-lg" onClick={() => setCommentDelete(item)}>...</div>
                                </Dropdown>
                              </div>
                            }
                          </div>
                        </Col>
                        <Col span={24}>
                          <p>{item?.comment}</p>
                        </Col>
                      </Row>
                      {index !== listComments.length - 1 && <hr></hr>}
                    </Col>
                  );
                })
              }
            </Row>
          </div>
        </div>
      }
    </>

  );
};

export default DetailBook;