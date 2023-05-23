/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Col, Form, Input, Row, Image, Button, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { EyeOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { API } from '../../configs';
import { changeTypePrice } from "../../utils/constant";
import { setIsLoading } from '../../redux/slice/AuthUserSlice';

const { TextArea } = Input;
const PaymentDetails = (props) => {
  const authUser = useSelector((state) => state.authUser);
  const [listCart, setListCart] = useState([]);
  const [price, setPrice] = useState();
  const [infoOrder, setInfoOrder] = useState({
    numberPhone: "",
    address: "",
    note: "",
    status: "order-success",
    fullName: authUser?.user?.userName || "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setListCart(props.carts);
    setPrice(props?.price);
  }, [props.carts]);

  const handleOrder = async () => {
    if (!infoOrder.address || !infoOrder.note || !infoOrder.numberPhone || !infoOrder.fullName) {
      notification["warning"]({
        message: "Vui lòng nhập đầy đủ các thông tin đặt hàng",
      });
    }
    else {
      const listNewCart = [];
      for (let index = 0; index < listCart.length; index++) {
        const data = await API.editUserCart(listCart[index].id, {
          bookId: listCart[index]?.book?.id,
          status: infoOrder.status,
          note: infoOrder.note,
          address: infoOrder.address,
          numberPhone: infoOrder.numberPhone,
          quantity: listCart[index].quantity
        });
        listNewCart.push(data);
      }
      Promise.all(listNewCart);
      props.setStatus();
      await props.getFullCartSuccess();
      props.refreshApi();
      dispatch(setIsLoading());
    }
  };

  return (
    <div className='mt-6'>
      <Row gutter={[16, 16]}>
        <Col lg={16} span={24} style={{
          border: "8px solid #F8F8F8",
          padding: "40px 50px 0px"
        }}>
          <Form>
            <h4 className="mt-6">THÔNG TIN THANH TOÁN</h4>
            <hr style={{ border: "1px solid rgb(159 147 147)" }} />
            <Row gutter={[8, 16]}>
              <Col span={12}>
                <Form.Item name="userName">
                  <Input
                    placeholder='Họ và Tên *'
                    className='!rounded-none'
                    value={infoOrder.fullName}
                    onChange={(value) => setInfoOrder({ ...infoOrder, fullName: value.target.value })}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="numberPhone">
                  <Input
                    placeholder='Số điện thoại *'
                    className='!rounded-none'
                    value={infoOrder.numberPhone}
                    onChange={(value) => setInfoOrder({ ...infoOrder, numberPhone: value.target.value })}
                  />
                </Form.Item>
              </Col>

            </Row>
            <Form.Item name="address">
              <Input
                placeholder='Địa chỉ *'
                className='!rounded-none'
                value={infoOrder.address}
                onChange={(value) => setInfoOrder({ ...infoOrder, address: value.target.value })}

              />
            </Form.Item>
            <Form.Item name="note">
              <TextArea
                rows={4}
                placeholder='Ghi chú *'
                className='!rounded-none'
                value={infoOrder.note}
                onChange={(value) => setInfoOrder({ ...infoOrder, note: value.target.value })}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col lg={8} span={24}>
          <div style={{
            border: "8px solid #F8F8F8",
            padding: "30px 20px",
            backgroundColor: "#f8f8f8"
          }}>
            <div className='mb-6 font-medium text-2xl'>Sản phẩm của bạn</div>
            <div>
              {listCart.map((item, index) => {
                return (
                  <div key={index} className='flex justify-between items-center relative'>
                    <div>
                      <Image
                        width={100}
                        height={100}
                        src={item?.book?.avatar_book?.image || BookDefault}
                        preview={{ mask: <EyeOutlined className='!text-lg' /> }}
                      />
                      <div
                        className='absolute top-0 z-10 left-24 cursor-pointer bg-black text-white w-5 h-5 rounded-full text-center'
                      >
                        {item?.quantity}
                      </div>
                    </div>
                    <div>
                      {changeTypePrice(item?.quantity * item?.book?.price)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='bg-white py-6 px-3'>
              <div className='flex justify-between items-center'>
                <div className='font-medium'>Tạm tính</div>
                <div>{changeTypePrice(price)}</div>
              </div>
              <hr style={{ border: "1px solid rgb(159 147 147)" }} />
              <div className='flex justify-between items-center'>
                <div className='font-medium'>Giao hàng</div>
                <div>Miễn phí vận chuyển</div>
              </div>
              <hr style={{ border: "1px solid rgb(159 147 147)" }} />
              <div className='flex justify-between items-center'>
                <div className='font-medium'>Tổng</div>
                <div>{changeTypePrice(price)}</div>
              </div>

            </div>

            <div className="my-4">
              <div className="my-4">
                Trả tiền mặt khi nhận hàng
              </div>
              <div className='bg-white p-4'>Nhận hàng, kiểm tra hàng. Trả tiền khi nhận hàng</div>

              <div className="mt-2">Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng, tăng trải nghiệm sử dụng website, và cho các mục đích cụ thể khác đã được mô tả trong chính sách riêng tư của chúng tôi.</div>
            </div>
            <Button
              size="large"
              type="primary"
              className="bg-[#f76b6a] text-white !rounded-none"
              onClick={handleOrder}
              disabled={listCart.length === 0 ? true : false}
            >
              ĐẶT HÀNG
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentDetails;