import React, { useEffect, useState } from 'react';
import { Layout, theme, Dropdown, Row, Col, Badge, notification } from 'antd';
import logo from "../../assets/images/logo.png";
import {
  ShoppingCartOutlined, UserOutlined, UnlockOutlined, PoweroffOutlined
} from '@ant-design/icons';
import UserAvatar from "../UserAvatar";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutService } from './Service';
import { API } from "../../configs";
import { setUser, setKeyPage, setIsLoading } from "../../redux/slice/AuthUserSlice";
import UserDefault from "../../assets/images/user-default.png";
const { Header, Content, Footer } = Layout;
import { Menu } from 'antd';

// eslint-disable-next-line react/prop-types
const AppLayoutUser = ({ children }) => {
  const authUser = useSelector((state) => state.authUser);
  const is_loading = authUser.is_loading;
  const currentPage = authUser.keyPage;
  const [refresh, setRefresh] = useState(true);
  const history = useHistory();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const dispatch = useDispatch();
  useEffect(() => {
    if (!is_loading) {
      API.getDetailsUser().then((response) => {
        dispatch(setUser(response?.data?.data));
      }).catch(() => {
        console.clear();
      });

    }
  }, [authUser, is_loading]);

  const items = [
    {
      key: "/profile",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "/change-password",
      label: "Change Password",
      icon: <UnlockOutlined />,
    },
    {
      key: "/logout",
      label: "Logout",
      icon: <PoweroffOutlined />,
    },
  ];

  const handleMenuClick = async (events) => {
    dispatch(setKeyPage({ keyPage: "" }));
    if (events.key) {
      if (events.key === "/logout") {
        dispatch(setIsLoading());
        LogoutService.run(dispatch);
        history.push("/login");
        // setRefresh(!refresh);
      } else {
        history.push(events.key);
      }
    }
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const itemsMenu = [
    {
      label: 'Trang chủ',
      key: '/',
    },
    {
      label: 'Danh mục',
      key: '/category',
    },
    {
      label: 'Tác giả',
      key: '/author',
    },
    {
      label: '',
      key: '/cart',
      icon: <div className='text-center flex justify-center items-center'>
        <Badge count={authUser?.user?.countCart}>
          <ShoppingCartOutlined className="w-full cursor-pointer mr-8 text-[#0c538e]" style={{ fontSize: "22px" }} />
        </Badge>
      </div>
    },
  ];

  const handleClickMenu = (e) => {
    if (e.key === "/cart" && is_loading === false) {
      notification["error"]({
        message: "Vui lòng đăng nhập",
      });
    } else {
      dispatch(setKeyPage({ keyPage: e.key }));
      history.push(e.key);
    }
  };


  return (
    <Layout className="layout">
      <Header className='flex justify-between items-center bg-white'>
        <div className="flex justify-center items-center">
          <img src={logo} alt="Logo" className="w-16 cursor-pointer" onClick={() => history.push("/")} />
          <h2 className='sm:block hidden ml-2 text-[#0c538e]'>Magic Book</h2>
        </div>
        <Menu mode="horizontal" items={itemsMenu} selectedKeys={[currentPage]} onClick={handleClickMenu} className='w-1/2 flex justify-center items-center' />
        <div className="flex justify-center items-center">
          {
            !is_loading &&
            (
              <div className='mr-8'>
                <span className='cursor-pointer text-base text-[#0c538e]' onClick={() => history.push("/login")}>Đăng nhập</span>
                <span className='text-[#0c538e] ml-2 mr-2 font-semibold text-sm'>/</span>
                <span className='cursor-pointer text-base text-[#0c538e]' onClick={() => history.push("/register")}>Đăng ký</span>
              </div>
            )
          }
          {
            is_loading && (
              <div>
                <Dropdown menu={menuProps} placement="bottomLeft">
                  <a href="#" className="flex justify-center items-center" style={{
                    color: "#FFFFFF",
                    overflow: "hidden",
                    maxWidth: "75ch"
                  }}>
                    <div className='md:block hidden text-overflow text-[#0c538e] mr-1'>{authUser?.user?.userName || authUser?.user?.email}</div>
                    <UserAvatar size={40} image={authUser?.user?.avatar_user?.image || UserDefault} />
                  </a>
                </Dropdown>
              </div>
            )
          }
        </div>
      </Header>
      <Content
        style={{
          padding: '0 50px',
        }}
      >
        <div
          className="site-layout-content"
          style={{
            background: colorBgContainer,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer className="my-8 mx-16">
        <h2 className='text-[#0c538e]'>Magic Book</h2>
        <Row gutter={[32, 16]}>
          <Col span={24} md={12} lg={6}>
            <div className="text-lg leading-8"><span className="font-semibold text-lg">Địa Chỉ:</span> Hà Đông - Hà Nội</div>
            <div className="text-lg leading-8"><span className="font-semibold text-lg">Hotline:</span> 088.977.8481</div>
            <div className="text-lg leading-8"><span className="font-semibold text-lg">Email:</span> margicbook@gmail.com</div>
          </Col>
          <Col span={24} md={12} lg={6}>
            <div className="font-semibold text-lg">Giới thiệu</div>
            <div className="text-lg leading-8">Vận Chuyển & Giao hàng</div>
            <div className="text-lg leading-8">Đổi Trả & Hoàn Tiền</div>
            <div className="text-lg leading-8">Điều Khoản Sử Dụng</div>
            <div className="text-lg leading-8">Chính Sách Sỉ</div>
          </Col>
          <Col span={24} md={12} lg={6}>
            <div className="font-semibold text-lg">Chính Sách Bảo Mật</div>
            <div className="text-lg leading-8">Điều Khoản & Điều Kiện Thanh Toán</div>
            <div className="text-lg leading-8">Điều Khoản & Điều Kiện Lập Hóa Đơn</div>
            <div className="text-lg leading-8">Bản Quyền Nội Dung Và Hình Ảnh</div>

          </Col>
          <Col span={24} md={12} lg={6}>
            <Row gutter={[32, 16]}>
              <Col span={12}>
                <div className="font-semibold text-lg">Thứ 2 - Thứ 6</div>
              </Col>
              <Col span={12}>
                <div className="text-lg leading-8">08:00 - 20:00</div>
              </Col>
            </Row>
            <Row gutter={[32, 16]}>
              <Col span={12}>
                <div className="font-semibold text-lg">Thứ 7</div>
              </Col>
              <Col span={12}>
                <div className="text-lg leading-8">09:00 - 21:00</div>
              </Col>
            </Row>
            <Row gutter={[32, 16]}>
              <Col span={12}>
                <div className="font-semibold text-lg">Chủ Nhật</div>
              </Col>
              <Col span={12}>
                <div className="text-lg leading-8">13:00 - 22:00</div>
              </Col>
            </Row>
            <img className='w-[191px] h-[35px]' src="https://tiemsachre.com/wp-content/uploads/2017/11/payment-icons.png" />
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};
export default AppLayoutUser;