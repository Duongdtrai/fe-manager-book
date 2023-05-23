import Error404 from "../pages/Errors/Page404";
/** Admin */
import LoginAdmin from "../pages/Admin/login";
import ListUser from "./Admin/User";
import DashBoard from "./Admin/Dashboard";
import ListBook from "./Admin/Books/ListBook";
import DetailBookAdmin from "./Admin/Books/DetailBook";
import ListCart from "./Admin/Carts";
import ChangePassword from "./Admin/ChangePassword";
import Profile from "./Admin/Profile";
import CreateAuthor from "./Admin/Author/CreateAuthor";
import ListAuthor from "./Admin/Author/ListAuthor";
import EditAuthor from "./Admin/Author/EditAuthor";
import ListCategoryAdmin from "./Admin/Category/ListCategory";
import DetailsCategoryAdmin from "./Admin/Category/DetailCategory";

/** User */
import LoginPage from "../pages/User/Login";
import HomePage from "../pages/User";
import RegisterPage from "./User/Register";
import AuthorPage from "./User/Author";
import CartPage from "./User/Cart";
import ChangePasswordPage from "./User/ChangePassword";
import ProfilePage from "./User/Profile";
import DetailAuthor from "../pages/User/Author/DetailAuthor";
import Category from "../pages/User/Category";
import DetailBook from "../pages/User/Books/DetailBook";

export {
  /** Admin */
  DashBoard,
  LoginAdmin,
  /** Admin - Screen User */
  ListUser,
  /** Admin - Screen List Book */
  ListBook,
  DetailBookAdmin,
  /** Admin - Screen List Cart */
  ListCart,
  /** Admin - Screen List Author */
  ListAuthor,
  CreateAuthor,
  EditAuthor,
  /** Admin - Screen List Category */
  ListCategoryAdmin,
  DetailsCategoryAdmin,
  /** Admin - Screen Change Password */
  ChangePassword,
  Profile,
  /** User */
  LoginPage,
  HomePage,
  RegisterPage,
  AuthorPage,
  CartPage,
  ChangePasswordPage,
  ProfilePage,
  DetailAuthor,
  Category,
  DetailBook,
  // error
  Error404,

};