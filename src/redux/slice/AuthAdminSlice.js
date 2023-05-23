import { createSlice } from "@reduxjs/toolkit";
import {STORAGE} from "../../configs";

export const initialState = {
  adminId: localStorage.getItem(STORAGE.adminId) || "",
  user: {},
  token: localStorage.getItem(STORAGE.accessTokenAdmin) || "",
  is_loading: true,
  role: 0
};

const Slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.user = action.payload;
      state.role = action.payload.role;
      state.is_loading = false;
    },
    setAdminToken: (state, action) => {
      localStorage.setItem(STORAGE.accessTokenAdmin, action.payload.token);
      localStorage.setItem(STORAGE.adminId, action.payload.userId);
      state.adminId = action.payload.userId;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    setIsLoading: (state) => {
      state.is_loading = true;
    },
    logout: (state) => {
      localStorage.clear();
      localStorage.removeItem(STORAGE.accessTokenAdmin);
      localStorage.removeItem(STORAGE.adminId);
      state.adminId = 0;
      state.user = {};
      state.token = "";
      state.role = 0;
      state.is_loading = true;
    },
  }
});

export const {setAdmin, setAdminToken, logout, setIsLoading} = Slice.actions;
export default Slice.reducer; 