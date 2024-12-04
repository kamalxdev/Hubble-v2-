import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ichatAreaSlice = {
  currentChatAreaUserID: string | null;
  isUserOnline: boolean;
  isUserTyping: boolean;
};

export const chatAreaSlice = createSlice({
  name: "chat",
  initialState: {} as ichatAreaSlice,
  reducers: {
    setCurrentChatAreaUserID: (state, action: PayloadAction<string>) => {
      return { ...state, currentChatAreaUserID: action?.payload };
    },
    removeCurrentChatAreaUserID: (state) => {
      return { ...state, currentChatAreaUserID: null };
    },
    setUserOnline: (state, action: PayloadAction<boolean>) => {
      return { ...state, isUserOnline: action?.payload };
    },
    setUserTyping: (state, action: PayloadAction<boolean>) => {
      return { ...state, isUserTyping: action?.payload };
    },
  },
});

export const {
  setCurrentChatAreaUserID,
  setUserOnline,
  setUserTyping,
  removeCurrentChatAreaUserID,
} = chatAreaSlice.actions;
export const chatAreaReducer = chatAreaSlice.reducer;
