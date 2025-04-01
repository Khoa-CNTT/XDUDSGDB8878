import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  room: "",
  userData: {
    connected: false,
    message: "",
  },
  userChat: {
    messages: [],
  },
  staffsOnline: [],
  isResizeChat: false,
};

// Tạo slice cho auth
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    saveChat: (state, action) => {
      state.room = action.payload.room;
      //   if (!state.userChat.messages) state.userChat.messages = [];
      //   state.userChat.messages = action.payload;
      state.userChat.messages = action.payload;
    },
    removeChat: (state, action) => {
      state.room = "";
      state.userChat.messages = [];
    },
    setStaffsOnline: (state, action) => {
      if (!state.staffsOnline) state.staffsOnline = [];
      state.staffsOnline = action.payload;
    },
    setStaffsOffline: (state, action) => {
      state.staffsOnline = [];
    },
    setResizeChat: (state, action) => {
      state.isResizeChat = true;
    },
    closeResizeChat: (state, action) => {
      state.isResizeChat = false;
    },
    add: (state, action) => {
      state.room = action.payload.room;
      state.userData = action.payload.userData;
    },
    update: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
  },
});

export const {
  add,
  update,
  saveChat,
  removeChat,
  setResizeChat,
  closeResizeChat,
  setStaffsOnline,
  setStaffsOffline,
} = chatSlice.actions;

export default chatSlice.reducer;
export const chatSelector = (state) => state.chat;
