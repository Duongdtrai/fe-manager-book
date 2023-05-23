/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Col, InputNumber, Popconfirm, Row, Table, notification, Image } from 'antd';
import { QuestionCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { changeTypePrice } from "../../utils/constant";
import { API } from '../../configs';
import BookDefault from "../../assets/images/bookDefault.png";
import { setIsLoading } from '../../redux/slice/AuthUserSlice';
import { useDispatch } from 'react-redux';

const ShoppingCart = (props) => {
  const [listCart, setListCart] = useState([]);
  const [price, setPrice] = useState();
  const dispatch = useDispatch();
  
  useEffect(() => {
    setListCart(props?.carts);
    setPrice(props?.price);
  }, [props?.carts, props?.price]);

  const handleDeleteCart = (id) => {
    API.deleteUserCart(id).then(() => {
      notification["success"]({
        message: "Xóa cart thành công",
      });
      dispatch(setIsLoading());
      props.refreshApi();
    }).catch(() => {
      notification["error"]({
        message: "Xóa cart không thành thành công",
      });
    });
  };

  const changeQuantity = (value, record, index) => {
    const dataChange = [...listCart];
    dataChange[index].quantity = value;
    setListCart(dataChange);
    setPrice(sumPrice(dataChange));
    props.updatePrice(sumPrice(dataChange));
  };
  
  const sumPrice = (carts) => {
    const sum = carts.reduce((accumulator, currentValue) => {
      const bookPrice = currentValue.book.price;
      const quantity = currentValue.quantity;
      const totalPrice = bookPrice * quantity;
      return accumulator + totalPrice;
    }, 0);
    return sum;
  };

  const columns = [
    {
      title: '',
      dataIndex: '',
      key: '',
      render: (_, record,index) => {
        return (
          <Popconfirm
            key={index}
            title="Xóa sản phẩm"
            description="Bạn có muốn xóa sản phẩm này không?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDeleteCart(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>

        );
      }
    },
    {
      title: 'Ảnh',
      dataIndex: 'book.avatar_book',
      key: 'book.avatar_book',
      render: (_, record, index) => 
        <Image
          key={index}
          width={100}
          height={100}
          src={record?.book?.avatar_book?.image || BookDefault}
          preview={{ mask: <EyeOutlined className='!text-lg' /> }}
        />
  
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => record?.book?.title
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => record?.book?.price ? changeTypePrice(record?.book?.price) : "-"
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record, index) => record.quantity ? <InputNumber
        key={index}
        className='!rounded-none'
        size="large"
        value={record.quantity}
        min={1}
        onChange={(value) => changeQuantity(value, record, index)}
      /> : "-"
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'price',
      key: 'priceSum',
      render: (_, record) => changeTypePrice(record?.book?.price * record.quantity)
    },
  ];

  return (
    <div className='mt-4'>
      <Row gutter={[8, 16]}>
        <Col lg={16} span={24}>
          <div>
            <Table dataSource={listCart} columns={columns} pagination={false}/>
          </div>
        </Col>
        <Col lg={8} span={24}>
          <div style={{
            border: "3px solid #ECECEC",
            padding: "30px 20px"
          }}>
            <div className='mb-6 font-medium text-2xl'>CỘNG GIỎ HÀNG</div>
            <div className='flex justify-between items-center'>
              <div className='font-medium'>Tạm tính</div>
              <div>{changeTypePrice(price)}</div>
            </div>
            <hr style={{ border: "1px solid #ECECEC" }} />
            <div className='flex justify-between items-center'>
              <div className='font-medium'>Giao hàng</div>
              <div>Miễn phí vận chuyển</div>
            </div>
            <hr style={{ border: "1px solid #ECECEC" }} />
            <div className='flex justify-between items-center'>
              <div className='font-medium'>Tổng</div>
              <div>{changeTypePrice(price)}</div>
            </div>
            <Button
              size="large"
              type="primary"
              className="bg-[#f76b6a] text-white !rounded-none mt-4"
              onClick={()=> props.setStatus()}
            >
              TIẾN HÀNH THANH TOÁN
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ShoppingCart;