import { iCallSlice } from "@/redux/features/call";
import { icallHistorySlice } from "@/redux/features/callHistory";
import { ichatAreaSlice } from "@/redux/features/chat";
import { iFriendSlice } from "@/redux/features/friends";
import { iUser } from "@/redux/features/user";

export interface iState {
    user: iUser;
    friends: iFriendSlice[];
    chat: ichatAreaSlice;
    toggle: "messages" | "calls";
    call: {} | iCallSlice;
    callHistory: icallHistorySlice[];
}