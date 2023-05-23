/* eslint-disable react/react-in-jsx-scope */
import {Route, Redirect} from "react-router-dom";
import {useSelector} from "react-redux";
import AppLayoutUser from "../components/AppLayoutUser";
// eslint-disable-next-line react/prop-types
export const PrivateRouteUser = ({ children, ...rest }) => {
  const auth = useSelector((state) => state.authAdmin);
  let isLogin = auth.token && auth.user;
  isLogin = true;
  return (
    <Route
      {...rest}
      render={({location}) =>
        isLogin ? (
          <AppLayoutUser>{children}</AppLayoutUser>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: {from: location},
            }}
          />
        )
      }
    />
  );
};

