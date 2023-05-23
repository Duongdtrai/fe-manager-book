import React, { useEffect, useState } from 'react';
import { Row, Col, Select, Image, Button, Empty, Menu, notification } from 'antd';
import { useSelector } from 'react-redux';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { CATEGORY_ALL_KEY } from '../../../utils/constant';
import { API } from '../../../configs';
import BookDefault from "../../../assets/images/bookDefault.png";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import PaginationCustom from "../../../components/PaginationCustomUser";
import LoadingComponent from '../../../components/LoadingComponent';
import "./index.scss";
import { useHistory } from 'react-router-dom';
import { RiTruckFill } from 'react-icons/ri';

const Category = () => {
  useDocumentTitle("Danh mục sản phẩm");
  const [listBooks, setListBooks] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [current, setCurrent] = useState(CATEGORY_ALL_KEY);
  const is_login = useSelector((state) => state.authUser.is_loading);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState({
    category: "",
    author: "",
    freeWord: ""
  });
  const [total, setTotal] = useState(0);
  const history = useHistory();
  
  useEffect(() => {
    setLoading(true);
    API.getAllBookLP(page, size, { author: "", category: "", freeWord: "" }).then((response) => {
      setListBooks(response?.data?.data?.data);
      setTotal(response?.data?.data?.count);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      notification["error"]({
        message: "Lấy danh sách không thành công",
      });
    }).finally(() => {
      console.clear();
    });
    API.getAllCategoryLP("").then((response) => {
      const data = response?.data?.data.rows;
      const menuItem = data.map((item) => {
        return {
          key: item.id,
          label: item.title
        };
      });
      setListCategory([{
        label: 'Tất cả',
        key: CATEGORY_ALL_KEY,
      }, ...menuItem]);
    }).catch(() => {
      setLoading(false);
      notification["error"]({
        message: "Lấy danh sách danh mục không thành công",
      });
    }).finally(() => {
      console.clear();
    });
  }, [refresh]);

  const handleChangeCategory = (value) => {
    setCurrent(value.key);
    if (value.key == CATEGORY_ALL_KEY) {
      setLoadingCategory(true);
      API.getAllBookLP(page, size, {
        author: search.author,
        category: "",
        freeWord: search.freeWord
      }).then((response) => {
        setListBooks(response?.data?.data);
        setSearch({
          author: search.author,
          category: "",
          freeWord: search.freeWord
        });
        setLoadingCategory(false);
      }).catch(() => {
        setLoadingCategory(false);
        notification["error"]({
          message: "Lấy danh sách theo danh mục không thành công",
        });
      });
    } else {
      setLoadingCategory(true);
      API.getAllBookLP(page, size, {
        author: search.author,
        category: value.key,
        freeWord: search.freeWord
      }).then((response) => {
        setSearch({
          author: search.author,
          category: value.key,
          freeWord: search.freeWord
        });
        setListBooks(response?.data?.data);
        setLoadingCategory(false);
      }).catch(() => {
        setLoadingCategory(false);
        notification["error"]({
          message: "Lấy danh sách theo danh mục không thành công",
        });
      });
    }
  };
  const handleAddCart = (bookId) => {
    if (is_login) {
      history.push(`books/${bookId}`);
    } else {
      notification["error"]({
        message: "Vui lòng đăng nhập"
      });
    }
  };


  const handleTableChange = (page, size) => {
    setPage(page);
    setSize(size);
    setRefresh(!refresh);
  };
  const handleCartBook = (bookId) => {
    if (is_login) {
      history.push(`books/${bookId}`);
    } else {
      notification["error"]({
        message: "Vui lòng đăng nhập"
      });
    }
  };
  
  return (
    <>{loading ? <LoadingComponent /> : <div className='container-category'>
      <div>
        <Image
          src='https://static.vecteezy.com/system/resources/previews/005/349/020/non_2x/horizontal-banner-with-childrens-and-books-boys-and-girls-are-standing-near-books-books-for-childrens-and-kids-i-love-reading-children-s-book-day-festival-poster-for-store-shop-library-vector.jpg'
          className='w-full h-auto'
          preview={false}
        />
      </div>
      <div className='m-8'>
        <div className="flex justify-center items-center my-10">
          <Menu onClick={handleChangeCategory} selectedKeys={[current]} mode="horizontal" items={listCategory} className='w-full' />
        </div>
        <div>
          {
            loadingCategory ? (
              <LoadingComponent />
            ) : (
              <>
                {listBooks.length === 0 ? (
                  <Empty />
                ) : (
                  <Row gutter={[32, 16]}>
                    {listBooks.map((item, index) => (
                      <Col
                        span={24}
                        sm={12}
                        md={8}
                        lg={6}
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
                  </Row>
                )}
                <div>
                  <PaginationCustom
                    total={total}
                    handleTableChange={handleTableChange}
                    current={page}
                  />
                </div>
              </>
            )
          }
        </div>
      </div>
    </div>
    }
    </>
  );
};
export default Category;