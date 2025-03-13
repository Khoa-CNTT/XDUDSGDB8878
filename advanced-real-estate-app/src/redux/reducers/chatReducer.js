import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    room: '',
    userData : {
        connected: false,
        message: "",
    },
};

// Tạo slice cho auth
const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        add: (state, action) => {
            state.room = action.payload.room;
            state.userData = action.payload.userData;
        },
        update: (state, action) => {
            state.userData = { ...state.userData, ...action.payload };
        }
    },
});

export const {
    add,
    update,
} = chatSlice.actions;
export default chatSlice.reducer;
export const chatSelector = (state) => state.chat;
