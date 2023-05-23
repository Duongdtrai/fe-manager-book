import React, { useState, useEffect } from 'react';
import { Empty, Row, Col, Image, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import API from '../../../configs/api';
import { useDispatch, useSelector } from 'react-redux';
import { setDetailAuthor } from "../../../redux/slice/AuthorUserSlice";
import UserDefault from "../../../assets/images/user-default.png";
import BookDefault from "../../../assets/images/bookDefault.png";
import { useHistory, useParams } from 'react-router-dom';
import Slider from "react-slick";
import './detail-author.module.scss';
import moment from 'moment';
import { DATE_FORMAT_YEAR } from '../../../utils/constant';
import { RiTruckFill } from 'react-icons/ri';


const DetailAuthor = () => {
  const dispatch = useDispatch();
  const detailAuthor = useSelector((state) => state.authorUser.detailAuthor);
  const { authorId } = useParams();
  const history = useHistory();
  const [listBook, setListBook] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(1000);
  const [search, setSearch] = useState({
    category: "",
    author: "",
    freeWord: ""
  });
  const is_login = useSelector((state) => state.authUser.is_loading);

  useEffect(() => {
    API.getDetailAuthorLP(authorId).then(response => {
      dispatch(setDetailAuthor(response?.data?.data));
    });
    API.getAllBookLP(page, size, { author: authorId, category: "", freeWord: "" }).then((response) => {
      setListBook(response?.data?.data?.data);
    }).catch(() => {
      notification["error"]({
        message: "Lấy danh sách không thành công",
      });
    }).finally(() => {
      console.clear();
    });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  const handleCartBook = (bookId) => {
    if (is_login) {
      history.push(`/books/${bookId}`);
    } else {
      notification["error"]({
        message: "Vui lòng đăng nhập"
      });
    }
  };

  return (
    <div className="detail-author">
      <Row gutter={[32, 32]} style={{ width: "100%" }}>
        <Col span={24}>
          <div
            className="sm:flex block items-center py-10 px-12 bg-white w-full rounded-lg"
          >
            <div>
              <Image
                src={detailAuthor?.avatar?.image || UserDefault}
                style={{ objectFit: 'contain', width: "100%" }}
                preview={{ mask: <EyeOutlined className='!text-lg' /> }}
              />
            </div>
            <div className='mt-2 sm:ml-5 w-full'>
              <Row gutter={[0, 16]}>
                <Col span={6} className="font-medium">Họ và tên:</Col>
                <Col span={18}> {detailAuthor.fullName}</Col>
              </Row>
              <Row gutter={[0, 16]}>
                <Col span={6} className="font-medium">Ngày sinh:</Col>
                <Col span={18}>{moment(detailAuthor.birthday).format(DATE_FORMAT_YEAR)}</Col>
              </Row>
              <Row gutter={[0, 16]}>
                <Col span={6} className="font-medium">Mô tả: </Col>
                <Col span={18}>{detailAuthor.description}</Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <h2>Một số tác phẩm nổi bật</h2>
      <Slider {...settings} className='flex justify-between items-center'>
        {listBook.map((item, index) => (
          <Col
            span={24}
            // sm={12}
            // md={8}
            // lg={6}
            key={index}
            style={{
              width: "100%",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
            className="cursor-pointer py-3"
            onClick={() => handleCartBook(item.id)}
          >
            <Image
              style={{ width: "100%", objectFit: "contain" }}
              src={item?.avatar_book?.image || BookDefault}
              preview={{ mask: <EyeOutlined className="!text-lg" /> }}
            />
            <div className="title-book">{item.title}</div>
            <div className="text-xl font-medium" style={{ color: "rgb(255, 66, 78)" }}>
              {item.price.toLocaleString("vi-VN", { style: "currency", currency: "vnd" })}
            </div>
            <div className="flex items-center gap-2">
              <div>Đã bán</div>
              <div>{item?.haveBuy || 0}</div>
            </div>
            <div className="flex items-center gap-2 text-base">
              <div className="text-[#26aa99]">
                <RiTruckFill />
              </div>
              <div>Miễn phí vận chuyển</div>
            </div>
          </Col>
        ))}
        {listBook.map((item, index) => (
          <Col
            span={24}
            // sm={12}
            // md={8}
            // lg={6}
            key={index}
            style={{
              width: "100%",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
            className="cursor-pointer py-3"
            onClick={() => handleCartBook(item.id)}
          >
            <Image
              style={{ width: "100%", objectFit: "contain" }}
              src={item?.avatar_book?.image || BookDefault}
              preview={{ mask: <EyeOutlined className="!text-lg" /> }}
            />
            <div className="title-book">{item.title}</div>
            <div className="text-xl font-medium" style={{ color: "rgb(255, 66, 78)" }}>
              {item.price.toLocaleString("vi-VN", { style: "currency", currency: "vnd" })}
            </div>
            <div className="flex items-center gap-2">
              <div>Đã bán</div>
              <div>{item?.haveBuy || 0}</div>
            </div>
            <div className="flex items-center gap-2 text-base">
              <div className="text-[#26aa99]">
                <RiTruckFill />
              </div>
              <div>Miễn phí vận chuyển</div>
            </div>
          </Col>
        ))}
      </Slider>
    </div>
  );
};
export default DetailAuthor;