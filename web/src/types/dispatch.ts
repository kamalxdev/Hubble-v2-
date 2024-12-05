import { ichatAreaSlice } from "@/redux/features/chat";
import { iFriendSlice } from "@/redux/features/friends";
import { iUser } from "@/redux/features/user";
import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";

export interface iDispatch
  extends ThunkDispatch<
    {
      user: iUser;
      friends: iFriendSlice[];
      chat: ichatAreaSlice;
    },
    undefined,
    UnknownAction
  > {example?:null}
