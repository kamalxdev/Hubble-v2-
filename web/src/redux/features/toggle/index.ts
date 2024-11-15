import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type iToggle = "messages" | "calls";

export const ToggleSlice = createSlice({
  name: "toggle",
  initialState: "messages" as iToggle,
  reducers: {
    sideBarToggle: (state, action: PayloadAction<iToggle>) => {
      return action.payload;
    },
  },
});

export const { sideBarToggle } = ToggleSlice.actions;
export const toggleReducer = ToggleSlice.reducer;
