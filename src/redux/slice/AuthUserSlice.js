import { createSlice } from "@reduxjs/toolkit";
import { STORAGE } from "../../configs";

export const initialState = {
  userId: null,
  user: {},
  accessTokenUser: localStorage.getItem(STORAGE.accessTokenUser) || "",
  keyPage: "/",
  is_loading: false
};

const Slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload.userId;
      state.is_loading = true;
    },
    setUser: (state, action) => {
      state.userId = Number(localStorage.getItem(STORAGE.userId));
      state.user = action.payload;
      state.is_loading = true;
    },
    setUserToken: (state, action) => {
      localStorage.setItem(STORAGE.accessTokenUser, action.payload.token);
      localStorage.setItem(STORAGE.userId, action.payload.userId);
      state.userId = action.payload.userId;
      state.accessTokenUser = action.payload.token;
      // state.is_loading = true;
    },
    setKeyPage: (state, action) => {
      state.keyPage = action.payload.keyPage;
    },
    setIsLoading: (state) => {
      state.is_loading = false;
    },
    logout: (state) => {
      localStorage.removeItem(STORAGE.userId);
      localStorage.removeItem(STORAGE.accessTokenUser);
      state.userId = 0;
      state.user = {};
      state.accessTokenUser = "";
      state.keyPage = "/";
      state.is_loading = false;
    },
  }
});

export const { setUserId, setUser, setUserToken, setKeyPage, logout, setIsLoading } = Slice.actions;
export default Slice.reducer; 