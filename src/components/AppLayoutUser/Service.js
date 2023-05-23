import { notification } from "antd";
import { API } from "../../configs";
import { logout } from "../../redux/slice/AuthUserSlice";

export const LogoutService = {
  run: (dispatch) => {
    API.logoutUser()
      .then(() => {
        dispatch(logout());
        notification["success"]({
          message: "Đăng xuất thành công",
        });
      });
  },
};
