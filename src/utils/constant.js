export const ROLE = {
  ADMIN: 1,
  EMPLOYEE: 2,
  USER: 3
};

export const LOGIN = {
  FAILED: false,
  SUCCESS: true,
};

export const IMAGE_TYPES = {
  jpeg: "image/jpeg",
  png: "image/png",
  jpg: "image/jpg",
  tif: "image/tif",
  heic: "image/heic",
};

export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_FORMAT_YEAR = "DD-MM-YYYY";
export const DATE_TIME = "HH:mm:ss DD-MM-YYYY";

export const CATEGORY_ALL_KEY = "ALL";

export const changeTypePrice = (price) => {
  let formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  return formatter.format(price);
};

export const CARTS = {
  IN_CART: "in-cart",
  ORDER_SUCCESS: "order-success",
  DELIVERY: "delivery",
  SUCCESS: "success",
};

export const STATUS_CARTS = {
  'in-cart': {
    color: "red",
    message: "Trong giỏ hàng"
  },
  'order-success': {
    color: "purple",
    message: "Đặt hàng thành công"
  },
  delivery: {
    color: "blue",
    message: "Đang giao hàng"
  },
  success: {
    color: "green",
    message: "Giao hàng thành công"
  },
};

export const ARR_CART_STATUS = [
  {
    value: 'order-success',
    label: 'Đặt hàng thành công',
  },
  {
    value: 'delivery',
    label: 'Đang giao hàng',
  }, {
    value: 'success',
    label: 'Giao hàng thành công',
  }
];