/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import { ROLE } from '../utils/constant';
// eslint-disable-next-line react/prop-types
export const PrivateRouteAdmin = ({ children, ...rest }) => {
  const is_loading_admin = useSelector((state) => state.authAdmin.is_loading);
  const [isLoginAdmin, setIsLoginAdmin] = useState(true);
  useEffect(() => {
    setIsLoginAdmin(isLoginAdmin);
  }, [is_loading_admin]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoginAdmin ? (
          <AppLayout>{children}</AppLayout>
        ) : (
          <Redirect
            to={{
              pathname: "/admin/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

