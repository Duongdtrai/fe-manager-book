import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { PrivateRouteAdmin } from "./PrivateRouteAdmin";
import { PrivateRouteUser } from "./PrivateRouteUser";
import AppLayoutUser from "../components/AppLayoutUser";
import {
  /**Admin */
  LoginAdmin,
  Error404,
  ListUser,
  DashBoard,
  ListBook,
  DetailBookAdmin,
  ChangePassword,
  Profile,
  ListAuthor,
  CreateAuthor,
  EditAuthor,
  ListCategoryAdmin,
  DetailsCategoryAdmin,
  /**User */
  LoginPage,
  HomePage,
  RegisterPage,
  AuthorPage,
  CartPage,
  ChangePasswordPage,
  ProfilePage,
  ListCart,
  EditCart,
  DetailAuthor,
  Category,
  DetailBook
} from "../pages";
import { useSelector } from "react-redux";

const RoutesProvider = () => {
  const is_loading_admin = useSelector((state) => state.authAdmin.adminId);
  const is_loading_user = useSelector((state) => state.authUser.userId);
  
  const [isLoginAdmin, setIsLoginAdmin] = useState(true);
  const [isLoginUser, setIsLoginUser] = useState(false);
  useEffect(() => {
    setIsLoginAdmin(is_loading_admin ? false : true);
  }, [is_loading_admin]);
  useEffect(() => {
    setIsLoginUser(is_loading_user ? false : true);
  }, [is_loading_user]);
  /**
   * @Role {admin}
   */
  const PrivateAdminPages = [
    {
      path: "/admin/list-user",
      component: <ListUser />,
    },
    {
      path: "/admin/list-book/:bookId",
      component: <DetailBookAdmin />,
    },
    {
      path: "/admin/list-book",
      component: <ListBook />,
    },
    {
      path: "/admin/create-book",
      component: <DetailBookAdmin />,
    },
    {
      path: "/admin/list-category/:categoryId",
      component: <DetailsCategoryAdmin />,
    },
    {
      path: "/admin/list-category",
      component: <ListCategoryAdmin />,
    },
    {
      path: "/admin/create-category",
      component: <DetailsCategoryAdmin />,
    },
    {
      path: "/admin/list-cart",
      component: <ListCart />,
    },
    {
      path: "/admin/list-author/:authorId",
      component: <EditAuthor />,
    },
    {
      path: "/admin/list-author",
      component: <ListAuthor />,
    },
    {
      path: "/admin/create-author",
      component: <CreateAuthor />,
    },
    {
      path: '/admin/change-password',
      component: <ChangePassword />,
    },
    {
      path: '/admin/profile',
      component: <Profile />,
    },
    {
      path: "/admin",
      component: <DashBoard />
    },
  ];

  /**
   * @Role {user}
   */
  const PrivateUserPages = [
    {
      path: "/category",
      component: <Category />,
    },
    {
      path: "/author/:authorId",
      component: <DetailAuthor />,
    },
    {
      path: "/author",
      component: <AuthorPage />,
    },
    {
      path: "/books/:bookId",
      component: <DetailBook />,
    },
    {
      path: "/cart",
      component: <CartPage />,
    }, {
      path: "/change-password",
      component: <ChangePasswordPage />,
    }, {
      path: "/profile",
      component: <ProfilePage />,
    }
  ];

  return (
    <BrowserRouter >
      <Switch>
        <Route exact path="/">
          <AppLayoutUser>
            <HomePage />
          </AppLayoutUser>
        </Route>
        <Route exact path="/admin/login">
          {!isLoginAdmin ? <Redirect to="/admin" /> : <LoginAdmin />}
        </Route>
        <Route exact path="/login">
          {!isLoginUser ? <Redirect to="/" /> : <AppLayoutUser><LoginPage /></AppLayoutUser>}
        </Route>
        <Route exact path="/register">
          {!isLoginUser ? <Redirect to="/" /> : <AppLayoutUser><RegisterPage /></AppLayoutUser>}
        </Route>
        {PrivateAdminPages.map((i, index) => {
          return (
            <PrivateRouteAdmin path={i.path} key={index}>
              {i.component}
            </PrivateRouteAdmin>
          );
        })}
        {PrivateUserPages.map((i, index) => {
          return (
            <PrivateRouteUser path={i.path} key={index} is_loading_admin={is_loading_admin}>
              {i.component}
            </PrivateRouteUser>
          );
        })}

        <Route path="*">
          <Error404 />
        </Route>
      </Switch>
    </BrowserRouter >
  );
};

export default RoutesProvider;