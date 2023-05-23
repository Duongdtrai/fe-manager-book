import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  listAuthor: [],
  detailAuthor: {},
  is_loading: false
};

const Slice = createSlice({
  name: "author_user",
  initialState,
  reducers: {
    setDetailAuthor: (state, action) => {
      state.detailAuthor = action.payload;
      state.is_loading = true;
    },
    setAuthor: (state, action) => {
      state.listAuthor = action.payload;
      state.is_loading = true;
    },
    clearDetailAuthor: (state) => {
      state.detailAuthor = {};
      state.is_loading = false;
    },
    clearListAuthor: (state) => {
      state.listAuthor = [];
      state.is_loading = false;
    },
  }
});

export const { setAuthor, setDetailAuthor, clearDetailAuthor, clearListAuthor } = Slice.actions;
export default Slice.reducer; 