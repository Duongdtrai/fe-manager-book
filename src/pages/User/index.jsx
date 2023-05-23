import React, { useEffect, useState } from 'react';
import { Col, Row, Empty, Image, Button, notification } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API } from '../../configs';
import BookDefault from "../../assets/images/bookDefault.png";
import Slider from "react-slick";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import LoadingComponent from '../../components/LoadingComponent';
import { RiTruckFill } from "react-icons/ri";
import "./index.scss";

const HomePage = () => {
  useDocumentTitle("Trang chủ");
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [listBooks, setListBooks] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const is_login = useSelector((state) => state.authUser.is_loading);
  const [seeMore, setSeeMore] = useState(true);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    API.getAllBookLP(page, size, { author: "", category: "", freeWord: "" }).then((response) => {
      setListBooks(response?.data?.data?.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      notification["error"]({
        message: "Lấy danh sách không thành công",
      });
    });
    API.getAllCategoryLP("").then((response) => {
      setListCategory(response?.data?.data.rows);
    }).catch(() => {
      setLoading(false);
      notification["error"]({
        message: "Lấy danh sách danh mục không thành công",
      });
    });
  }, [refresh]);

  const handleCartBook = (bookId) => {
    if (is_login) {
      history.push(`books/${bookId}`);
    } else {
      notification["error"]({
        message: "Vui lòng đăng nhập"
      });
    }
  };

  const settingsHome = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: false,
    nextArrow: false,
  };
  const settingsCategory = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1
  };

  const handleClickViewAdd = () => {
    setSize(20);
    setLoadingAdd(true);
    API.getAllBookLP(page, 20, { author: "", category: "", freeWord: "" }).then((response) => {
      setListBooks(response?.data?.data?.data);
      setSeeMore(false);
    }).catch(() => {
      notification["error"]({
        message: "Lấy danh sách không thành công",
      });
    }).finally(() => {
      setLoadingAdd(false);
      console.clear();
    });
  };

  return (
    <>
      {loading ? <LoadingComponent /> : <div>
        <div>
          <Slider {...settingsHome} prevArrow={false} nextArrow={false} arrows={false}>
            <div>
              <img className='object-contain w-full h-full' src="https://www.lionsroar.com/wp-content/uploads/2021/07/Review-Bookshelf-x-8-6_14_21-Cropped-2.jpg" />
            </div>
            <div>
              <img className='object-contain w-full h-full' src="https://noithatecohome.com/wp-content/uploads/2019/02/cach-lam-ke-sach-de-ban-ecohome-17.jpg" />
            </div>
            <div>
              <img className='object-contain w-full h-full' src="https://www.lionsroar.com/wp-content/uploads/2022/09/reviews-crop-nov22-1024x585.png" />
            </div>
          </Slider>
        </div>
        <div className='m-8 container-home'>
          <div className="text-center font-semibold text-3xl">Danh mục sản phẩm</div>
          <Slider {...settingsCategory}>
            {listCategory.map((item) =>
              <div className="p-3 cursor-pointer" key={item.id} onClick={() => history.push("/category")}>
                <Image
                  className="rounded-xl"
                  src={item?.avatar_category?.image || BookDefault}
                  preview={false}
                />
                <div className="text-center text-xl font-semibold">{item.title}</div>
              </div>
            )}
          </Slider>
          <div className="text-center font-semibold text-3xl my-8">ĐỀ XUẤT CHO BẠN</div>
          <div>
            {
              listBooks?.length === 0 ? <Empty /> :
                <>
                  <Row gutter={[32, 16]}>
                    {
                      listBooks.map((item, index) => {
                        return (
                          <Col
                            span={24}
                            sm={12}
                            md={8}
                            lg={6}
                            key={index}
                            style={{
                              width: "100%",
                              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                            }}
                            className="cursor-pointer py-3"
                            onClick={() => handleCartBook(item.id)}
                          >
                            <Image
                              style={{ width: "100%", objectFit: "contain" }}
                              src={item?.avatar_book?.image || BookDefault}
                              preview={{ mask: <EyeOutlined className='!text-lg' /> }}
                            />
                            <div className="title-book">{item.title}</div>

                            <div className='text-xl font-medium' style={{ color: "rgb(255, 66, 78)" }}>
                              {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'vnd' })}
                            </div>
                            <div className='flex items-center gap-2'>
                              <div>Đã bán</div>
                              <div>
                                {item?.haveBuy}
                              </div>
                            </div>
                            <div className="flex items-center gap-2  text-base">
                              <div className="text-[#26aa99]">
                                <RiTruckFill />
                              </div>
                              <div>Miễn phí vận chuyển</div>
                            </div>
                          </Col>
                        );
                      })
                    }
                  </Row>
                </>
            }
          </div>
          {
            seeMore && <div className='text-center mt-4'>
              <Button
                className='border-dashed w-44 h-12 rounded-3xl'
                onClick={handleClickViewAdd}
                loading={loadingAdd}>
                Xem thêm ...
              </Button>
            </div>
          }
        </div>
        <div className='banner my-8'>
          <div className='w-full relative'>
            <img src="https://tiemsachre.com/wp-content/uploads/2022/05/9-banner-9-copy.jpeg" className='w-full sm:h-auto h-[200px] object-cover' alt="banner" />
            <div className='absolute lg:top-20 lg:left-20 md:top-12 left-12 top-2'>
              <div className='text-base lg:text-2xl mb-3'>Sách mới về</div>
              <div className='font-semibold text-lg lg:text-3xl'>Khuyến mãi <span className='text-[#fcb900]'>từ 50%</span> </div>
              <div className='font-semibold text-lg lg:text-3xl'>Tất Cả Sách & Phụ kiện</div>
              <Button className='border-dashed w-40 h-10 rounded-3xl bg-[#fcb900] text-white mt-2'>Xem ngay</Button>
            </div>
          </div>
        </div>
        <div className='m-8'>
          <div>
            <Row gutter={[32, 16]}>
              <Col span={24} lg={6} className='text-center border-dashed border p-6'>
                <div className='font-semibold text-xl'>MIỄN SHIP</div>
                <div>Miễn ship đơn hàng từ 299k</div>
              </Col>
              <Col span={24} lg={6} className='text-center border-dashed border p-6'>
                <div className='font-semibold text-xl'>HỖ TRỢ 24/7</div>
                <div>Chúng tôi hỗ trợ 24h/24h</div>
              </Col>
              <Col span={24} lg={6} className='text-center border-dashed border p-6'>
                <div className='font-semibold text-xl'>HOÀN TIỀN 100%</div>
                <div>Hoàn tiền trong 7 ngày đầu</div>
              </Col>
              <Col span={24} lg={6} className='text-center border-dashed border p-6'>
                <div className='font-semibold text-xl'>MIỄN SHIP</div>
                <div>Bảo mật thanh toán</div>
              </Col>
            </Row>
          </div>

          <div className='text-center mt-8 italic text-lg'>“Đặt sự hài lòng của khách hàng là ưu tiên số 1 trong mọi suy nghĩ hành động của mình” là sứ mệnh, là triết lý, chiến lược.. luôn cùng khách hàng tiến bước”</div>
        </div>
      </div>
      }
    </>
  );
};

export default HomePage;