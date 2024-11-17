import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { iFriend } from "@/types/user";

export type icallHistorySlice = {
  id: string;
  caller? : iFriend;
  receiver? : iFriend;
  answer:boolean;
  createdAt:string;
  type: "video" | "voice"
};

export const callHistorySlice = createSlice({
  name: "callHistory",
  initialState: [] as icallHistorySlice[],
  reducers: {
    setCallHistory: (state, actions: PayloadAction<icallHistorySlice[]>) => {
      return [ ...state, ...actions.payload ];
    },
  },
});

export const { setCallHistory} = callHistorySlice.actions;
export const callHistoryReducer = callHistorySlice.reducer;
