import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { API } from '../../../configs';
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import ShoppingCart from '../../../components/Cart/ShoppingCart';
import PaymentDetails from '../../../components/Cart/PaymentDetails';
import OrderSuccess from '../../../components/Cart/OrderSuccess';
import "./index.scss";
import { CARTS } from '../../../utils/constant';


const CartPage = () => {
  useDocumentTitle('Giỏ hàng | Margic Book');
  const [status, setStatus] = useState(1);
  const [listCart, setListCart] = useState([]);
  const [listCartSuccess, setListCartSuccess] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    API.getAllCartUser("in-cart").then((response) => {
      setListCart(response?.data?.data?.rows);
      setPrice(sumPrice(response?.data?.data?.rows));
    }).catch(() => {
      notification["error"]({
        message: "Mở giỏ hàng không thành công",
      });
    }).finally(() => {
      console.clear();
    });
  }, [refresh]);


  const handleChangeTab = async (key) => {
    setStatus(key);
    if (key === 3) {
      await getFullCartSuccess();
    }
  };

  const getFullCartSuccess = () => {
    API.getAllCartUser(CARTS.ORDER_SUCCESS).then((response) => {
      setListCartSuccess(response?.data?.data?.rows);
      setPrice(sumPrice(response?.data?.data?.rows));
    }).catch(() => {
      notification["error"]({
        message: "Mở giỏ hàng không thành công",
      });
    });
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

  const updatePrice = (priceNew) => {
    setPrice(priceNew);
  };

  const refreshApi = () => {
    setRefresh(!refresh);
  };


  return (
    <div className='container-cart'>
      <div className='flex gap-2 md:flex-row flex-col justify-start md:justify-around items-start md:items-center bg-[#fafafa] py-4'>
        <div
          className='flex items-center gap-2 text-xl cursor-pointer font-medium'
          onClick={() => handleChangeTab(1)}
          style={status === 1 ? { opacity: "1" } : { opacity: "0.5" }}
        >
          <div className='text-5xl'>01</div>
          <div>
            <div>GIỎ HÀNG MUA SẮM</div>
            <div>Quản Lý Danh Sách Mặt Hàng Của Bạn</div>
          </div>
        </div>
        <div
          className='flex items-center gap-2 text-xl cursor-pointer font-medium'
          onClick={() => handleChangeTab(2)}
          style={status === 2 ? { opacity: "1" } : { opacity: "0.5" }}
        >
          <div className='text-5xl'>02</div>
          <div>
            <div>CHI TIẾT THANH TOÁN</div>
            <div>Kiểm tra danh sách mặt hàng của bạn</div>
          </div>
        </div>
        <div
          className='flex items-center gap-2 text-xl cursor-pointer font-medium'
          onClick={() => handleChangeTab(3)}
          style={status === 3 ? { opacity: "1" } : { opacity: "0.5" }}
        >
          <div className='text-5xl'>03</div>
          <div>
            <div>ĐẶT HÀNG THÀNH CÔNG</div>
            <div>Xem lại đơn hàng của bạn</div>
          </div>
        </div>
      </div>
      <div className="p-10">
        {
          status === 1 && <ShoppingCart
            carts={listCart}
            price={price}
            setStatus={() => setStatus(2)}
            updatePrice={updatePrice}
            refreshApi={refreshApi}
          />
        }
        {
          status === 2 && <PaymentDetails
            setStatus={() => setStatus(3)}
            carts={listCart}
            price={price}
            getFullCartSuccess={getFullCartSuccess}
            refreshApi={refreshApi}
          />
        }
        {
          status === 3 && <OrderSuccess
            cartSuccess={listCartSuccess.filter((item) => item.status !== CARTS.IN_CART)}
          />
        }
      </div>
    </div>
  );
};

export default CartPage;