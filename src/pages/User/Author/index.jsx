import React, { useState, useEffect } from 'react';
import { Empty, Row, Col, Image } from 'antd';
import API from '../../../configs/api';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthor } from "../../../redux/slice/AuthorUserSlice";
import UserDefault from "../../../assets/images/user-default.png";
import { useHistory } from 'react-router-dom';
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import LoadingComponent from '../../../components/LoadingComponent';
import { DATE_FORMAT_YEAR } from '../../../utils/constant';
import moment from "moment";

const AuthorPage = () => {
  useDocumentTitle("Tác giả | Margic Book");
  const dispatch = useDispatch();
  const listAuthor = useSelector((state) => state.authorUser.listAuthor);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [freeWord, setFreeWord] = useState("");

  useEffect(() => {
    setLoading(true);
    API.getAllAuthorLP(page, size, freeWord).then(response => {
      dispatch(setAuthor(response?.data?.data?.rows));
      setLoading(false);
    }).catch(() => {
      notification["error"]({
        message: "Lấy danh sách tác giả không thành công",
      });
      setLoading(false);
    }).finally(() => {
      console.clear();
    });
  }, []);

  return (
    <>{loading ? <LoadingComponent /> : <div>
      {
        listAuthor.length === 0 ? <Empty /> :
          <>
            <Row gutter={[32, 32]} style={{ width: "100%" }} className='mt-4'>
              {
                listAuthor.map((item, index) => {
                  return (
                    <Col span={12} key={index} onClick={() => history.push(`/author/${item.id}`)}>
                      <div
                        style={{
                          border: "1px solid #d7d7d7",
                          borderRadius: 10,
                          width: "100%",
                          backgroundColor: "#ffffff",
                          padding: "32px 24px",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer"
                        }}
                      >
                        <div>
                          <Image
                            width={100}
                            height={100}
                            src={item?.avatar?.image || UserDefault}
                            style={{ objectFit: 'contain' }}
                            preview={false}
                          />
                        </div>
                        <div className='ml-5 w-full'>
                          <Row gutter={[16, 16]}>
                            <Col span={6} className="font-medium">Họ và tên:</Col>
                            <Col span={18}> {item.fullName}</Col>
                          </Row>
                          <Row gutter={[16, 16]}>
                            <Col span={6} className="font-medium">Ngày sinh:</Col>
                            <Col span={18}>{moment(item.birthday).format(DATE_FORMAT_YEAR)}</Col>
                          </Row>
                          <Row gutter={[16, 16]}>
                            <Col span={6} className="font-medium">Mô tả: </Col>
                            <Col span={18} style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              WebkitLineClamp: 2,
                            }}>{item.description}</Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  );
                })
              }
            </Row>
          </>
      }
    </div>}

    </>
  );
};
export default AuthorPage;