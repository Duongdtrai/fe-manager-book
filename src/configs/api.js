import { httpCMS, httpLP } from "../utils/http";
export const BearerTokenCMS = () => {
  return `Bearer ${localStorage.getItem("accessTokenAdmin")}`;
};
export const BearerTokenUserLP = () => {
  return `Bearer ${localStorage.getItem("accessTokenUser")}`;
};

const API = {
  /** API ADMIN */
  loginAdmin: (data) => httpCMS.post("user/login", data),
  getDetailsAdmin: () => httpCMS.get(`user/detail`),
  updateInforAdmin: (data) => httpCMS.put("user/edit-user", data),
  uploadImageAdmin: (formData) => httpCMS.post("user/upImageAdmin", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }),
  changePasswordCMS: (data) => httpCMS.put("user/change-password", data),
  logout: () => httpCMS.post("user/logout"),
  refreshTokenAdmin: () => httpCMS.post("user/refresh-token"),

  /** API USER*/
  loginUser: (data) => httpLP.post("user/loginLP", data),
  getDetailsUser: () => httpLP.get("user/details"),
  registerUser: (data) => httpLP.post("user/register", data),
  uploadImageUser: (formData) => httpLP.post("user/upImageUser", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }),
  changePasswordLP: (data) => httpLP.put("user/change-password-user", data),
  updateInforUser: (data) => httpLP.put(`user/edit-user-lp`, data),
  refreshTokenUser: () => httpLP.post("user/refresh-token-user"),
  logoutUser: () => httpLP.post("user/logout"),


  getAllUser: (page, size, freeWord) => httpCMS.get("user/get-all", {
    params: {
      page,
      size,
      freeWord
    }
  }),
  detailsUser: (userId) => http.get(`auth/${userId}`, {
    headers: {
      Authorization: BearerToken()
    }
  }),


  /** API BOOKS */
  getAllBookCMS: (page, size, freeWord) => httpCMS.get("book/list-book", {
    params: {
      page,
      size,
      freeWord
    }
  }
  ),
  getDetailBookCMS: (bookId) => httpCMS.get(`book/${bookId}`),
  upImageBook: (formData) => httpCMS.post("book/upImage", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }),
  createNewBook: (data) => httpCMS.post("book/create-new-book", data),
  updateBook: (data, bookId) => httpCMS.put(`book/edit-book/${bookId}`, data),
  deleteBook: (bookId) => httpCMS.delete(`book/delete-book/${bookId}`),


  getAllBookLP: (page, size, { author, category, freeWord }) => httpLP.get("book/user/list-book", {
    params: {
      page,
      size,
      category,
      author,
      freeWord
    }
  }),
  getDetailBookLP: (bookId) => httpLP.get(`book/user/${bookId}`),
  /** API AUTHOR */
  getAllAuthorCMS: (page, size, freeWord) => httpCMS.get("author/list-author", {
    params: {
      page, size, freeWord
    }
  }),
  getDetailAuthor: (authorId) => httpCMS.get(`author/${authorId}`),
  createNewAuthor: (data) => httpCMS.post("author/create-author", data),
  updateAuthor: (authorId, data) => httpCMS.put(`author/edit-author/${authorId}`, data),
  deleteAuthor: (authorId) => httpCMS.delete(`author/delete-author/${authorId}`),
  uploadAvatarAuthorCMS: (formData) => httpCMS.post("author/upImage", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  getAllAuthorLP: (page, size, freeWord) => httpLP.get("author/list-author", {
    params: {
      page, size, freeWord
    }
  }),
  getDetailAuthorLP: (authorId) => httpLP.get(`author/${authorId}`),
  /** API AUTHOR */
  getAllCategoryCMS: (page, size, freeWord) => httpCMS.get("category/list-category", {
    params: {
      page, size, freeWord
    }
  }),
  getDetailCategoryCMS: (categoryId) => httpCMS.get(`category/${categoryId}`),
  createNewCategory: (data) => httpCMS.post("category/create-category", data),
  updateCategory: (categoryId, data) => httpCMS.put(`category/edit-category/${categoryId}`, data),
  deleteCategory: (categoryId) => httpCMS.delete(`category/delete-category/${categoryId}`),
  uploadImageCategoryCMS: (formData) => httpCMS.post("category/upImage", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  getAllCategoryLP: (freeWord) => httpLP.get("category/user/list-category-user", {
    params: {
      freeWord
    }
  }),
  /** API CART BOOK */
  getAllCartAdmin: (page, size, freeWord) => httpCMS.get("cart/list-cart", {
    params: {
      page,
      size,
      freeWord
    }
  }),
  editCart: (cartId, data) => httpCMS.put(`cart/edit-cart/${cartId}`, data),
  getAllCartUser: (statusCart) => httpLP.get("cart/user/list-cart-user", {
    params: {
      statusCart
    }
  }),

  createNewCart: (data) => httpLP.post("cart/user/create-new-cart", data),
  editUserCart: (cartId, data) => httpLP.put(`cart/user/edit-cart/${cartId}`, data),
  deleteUserCart: (id) => httpLP.delete(`cart/user/delete-cart/${id}`),


  borrowBookUser: (data, bookId) => http.post(`borrowbook/add/${bookId}`, data, {
    headers: {
      Authorization: BearerTokenUser()
    }
  }),

  /** API RETURN BOOK */
  getAllReturnAdmin: () => http.get("returnbook/all", {
    headers: {
      Authorization: BearerToken()
    }
  }),

  getAllReturnUser: () => http.get("returnbook/get", {
    headers: {
      Authorization: BearerToken()
    }
  }),

  returnBookUser: (borrowBookId) => http.post(`returnbook/add/${borrowBookId}`, {
    headers: {
      Authorization: BearerToken()
    }
  }),
  /** COMMENT BOOK*/
  createCommentBook: (data) => httpLP.post(`comment/create-comment-user`, data),
  deleteCommentBook: (commentId) => httpLP.delete(`comment/delete-comment-user/${commentId}`)

};
export default API;