import { iChats } from "@/types/chats";
import { iFriend } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type iFriendSlice = {
  detail: iFriend;
  chats: iChats[];
};

export const friendSlice = createSlice({
  name: "friends",
  initialState: [] as iFriendSlice[],
  reducers: {
    updateFriends: (state, action: PayloadAction<iFriendSlice>) => {
      let userPayload=action?.payload
      let isFriend = state.findIndex(
        (f) => f?.detail?.id == userPayload.detail?.id
      );
      const friendar=state[isFriend];

      if (isFriend>=0) {        
        state.splice(isFriend, 1);

        if(action.payload?.chats.length<1){
          userPayload.chats=friendar?.chats
        }
      }
      state.push(userPayload);
    },
    updateChats: (
      state,
      action: PayloadAction<{ id: string; chats: iChats }>
    ) => {
      const friendIndex = state.findIndex(
        (f) => f?.detail?.id == action?.payload?.id
      );
      let Updatedfriendar = state[friendIndex];
      Updatedfriendar.chats.push(action?.payload?.chats);
      state.splice(friendIndex, 1);
      state.push(Updatedfriendar);
    },
    setFriends: (state, action: PayloadAction<iFriendSlice[]>) => {
      state.concat(action?.payload);
    },
  },
});

export const { updateFriends, updateChats, setFriends } = friendSlice.actions;
export const friendReducer = friendSlice.reducer;
