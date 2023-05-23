import React, { useEffect, useState } from 'react';
import logo from '../../assets/images/logo.png';
import {
  MoneyCollectOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  PoweroffOutlined,
  UnlockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Dropdown, Layout, Menu, notification } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { LogoutService } from "./Service";
import UserAvatar from "../UserAvatar";
import { STORAGE, API } from '../../configs';
import { setAdmin } from "../../redux/slice/AuthAdminSlice";
import UserDefault from "../../assets/images/user-default.png";
import {BiCategory, BiBookBookmark} from "react-icons/bi";

const { Header, Content, Sider } = Layout;

const leftMenuListAdmin = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: 'Dashboard'
  },
  {
    key: '/admin-user',
    icon: <UserOutlined />,
    label: 'Quản lý người dùng',
    children: [
      {
        icon: <UserOutlined />,
        key: '/admin/list-user',
        label: "Quản lý người dùng",
      },
      {
        icon: <UserOutlined />,
        key: '/admin/list-author',
        label: 'Quản lý tác giả',
      },
    ]
  },
  {
    key: '/admin/list-book',
    icon: <BiBookBookmark />,
    label: 'Quản lý danh sách Book',
  },
  {
    key: '/admin/list-category',
    icon: <BiCategory />,
    label: 'Quản lý danh mục',
  },
  {
    key: '/admin/list-cart',
    icon: <ShoppingCartOutlined />,
    label: 'Quản lý giỏ hàng',
  },
];

// eslint-disable-next-line react/prop-types
const AppLayout = ({ children }) => {
  const user = useSelector((state) => state.authAdmin.user);
  const is_loading = useSelector((state) => state.authAdmin.is_loading);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (is_loading) {
      API.getDetailsAdmin().then((response) => {
        dispatch(setAdmin(response?.data?.data));
      }).catch(() => {
        notification["error"]({
          message: "Vui lòng đăng nhập lại",
        });
        history.push("/admin/login");
      });
    }
  }, [user, is_loading]);

  const items = [
    {
      key: "/admin/profile",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "/admin/change-password",
      label: "Change Password",
      icon: <UnlockOutlined />,
    },
    {
      key: "/admin/logout",
      label: "Logout",
      icon: <PoweroffOutlined />,
    },
  ];

  const onLogout = () => {
    localStorage.clear();
    history.push("/admin/login");
  };

  const handleMenuClick = (events) => {
    if (events.key) {
      if (events.key === "/admin/logout") {
        LogoutService.run(dispatch, { user: localStorage.getItem(STORAGE.adminId) }, onLogout);
        // localStorage.clear();
        history.push("/admin/login");
      } else {
        history.push(events.key);
      }
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const [openKeys, setOpenKeys] = useState(() => {
    return JSON.parse(localStorage.getItem('openMenu') || "[]");
  });

  const onOpenChange = (key) => {
    setOpenKeys(key);
    localStorage.setItem('openMenu', JSON.stringify(key));
  };

  return (
    <Layout className="min-vh-100">
      <Header style={{ backgroundColor: 'white', borderBottom: '1px solid #c9c9c9', position: 'sticky', top: 0, zIndex: 1, width: '100%', display: 'flex' }} className='justify-between items-center'>
        <div className="logo d-inline !flex justify-between items-center">
          <img onClick={() => {
            history.push("/admin");
          }} src={logo} alt="Exponential Africa" className='logo'
          style={{ display: 'flex', height: "50px", paddingTop: "5px", cursor: "pointer" }} />
          <div className="ml-4 text-xl sm:block hidden">Hệ thống quản lý thư viện sách</div>
        </div>
        <div className="pe-3 d-inline float-end me-3">
          {!is_loading && <Dropdown menu={menuProps} placement="bottomLeft">
            <a href="#" className="d-block" style={{ color: "#FFFFFF", overflow: "hidden", maxWidth: "75ch" }}>
              <label className="text-overflow text-black" >{user?.userName ? user?.userName : user?.email }</label>&ensp;
              <UserAvatar size={40} image={user?.avatar_user?.image ? user?.avatar_user?.image: UserDefault} />
            </a>
          </Dropdown>
          }
        </div>
      </Header>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={250} style={{ overflow: 'auto', height: '100vh', position: 'fixed' }} breakpoint="md" collapsedWidth={80}>
          <Menu
            onClick={({ key }) => {
              history.push(key);
            }}
            mode="inline"
            selectedKeys={[window.location.pathname]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{ height: '100%', borderRight: 0 }}
            items={leftMenuListAdmin}
          />
        </Sider>
        <Layout style={{ marginLeft: 250 }} className='md:!ml-64 !ml-24'>
          <Content style={{ flexGrow: 1, padding: 24, height: "100vh" }}>
            <div style={{ padding: 24, background: "#FFFFFF" }}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
