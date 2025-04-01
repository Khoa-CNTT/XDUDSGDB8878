import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo state ban đầu
const initialState = {
  isAuth: false,
  token: "", // Token người dùng sau khi đăng nhập
  roles: "", // Vai trò của người dùng ('admin' hoặc 'client')
  info: {},
  roleUser: {},
  permission: [],
  listRoleManagerPage: [],
};

// Tạo slice cho auth
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRoleManagerPage(state, action) {
      state.listRoleManagerPage = action.payload;
    },
    removeRoleManagerPage(state, action) {
      state.listRoleManagerPage = [];
    },
    addAuth: (state, action) => {
      state.isAuth = true;
      state.info = action.payload.info;
      state.token = action.payload.token;
      state.roles = action.payload.roles;
      state.roleUser = action.payload.roleUser;
      state.permission = action.payload.permission;
    },
    removeAuth: (state) => {
      state.isAuth = false;
      state.token = "";
      state.roles = [];
      state.info = {};
      state.roleUser = {};
      state.permission = [];
    },
    refreshtoken: (state, action) => {
      state.token = action.payload.token;
    },
  },
});

// Export các action và reducer
export const {
  addAuth,
  removeAuth,
  setRoleManagerPage,
  removeRoleManagerPage,
} = authSlice.actions;
export default authSlice.reducer;

// Selector để lấy trạng thái auth
export const authSelector = (state) => state.auth;
