import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type ichatAreaSlice = {
  currentChatAreaUserID : string;
  isUserOnline : boolean;
};

export const chatAreaSlice = createSlice({
  name: "chat",
  initialState: {} as ichatAreaSlice,
  reducers: {
    setCurrentChatAreaUserID : (state,action:PayloadAction<string>)=>{
        state.currentChatAreaUserID = action.payload;
    },
    setIsUserOnline : (state,action:PayloadAction<boolean>)=>{
        state.isUserOnline = action.payload;
    },
  },
});

export const { setCurrentChatAreaUserID,setIsUserOnline } = chatAreaSlice.actions;
export const chatAreaReducer = chatAreaSlice.reducer;
