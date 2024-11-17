import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { iFriend } from "@/types/user";

export type iCallSlice = {
  id: string;
  user: iFriend | undefined;
  isAnswered: boolean;
  isSender:boolean;
  type: "video" | "voice"
};

export const callSlice = createSlice({
  name: "call",
  initialState: {} as iCallSlice | {},
  reducers: {
    setCall: (state, actions: PayloadAction<iCallSlice>) => {
      return { ...state, ...actions.payload };
    },
    callAnswered: (state) => {
      return { ...state, isAnswered: true };
    },
    callRejected: () => {
      return {};
    },
  },
});

export const { setCall ,callAnswered,callRejected} = callSlice.actions;
export const callReducer = callSlice.reducer;
