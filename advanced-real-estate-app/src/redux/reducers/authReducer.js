import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo state ban đầu
const initialState = {
    isAuth: false,
    token: '', // Token người dùng sau khi đăng nhập
    roles: '', // Vai trò của người dùng ('admin' hoặc 'client')
    info: {},
    permission : [],
};

// Tạo slice cho auth
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addAuth: (state, action) => {
            state.isAuth = true;
            state.token = action.payload.token;
            state.roles = action.payload.roles;
            state.info = action.payload.info;
            state.permission = action.payload.permission;
        },
        removeAuth: (state) => {
            state.isAuth = false;
            state.token = '';
            state.roles = [];
            state.info = {};
            state.permission = [];
        },
        refreshtoken: (state, action) => {
            state.token = action.payload.token;
        },
    },
});

// Export các action và reducer
export const { addAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;

// Selector để lấy trạng thái auth
export const authSelector = (state) => state.auth;
