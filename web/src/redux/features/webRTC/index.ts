import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type iwebRTCSlice={
    sender:RTCPeerConnection | null;
    reciever:RTCPeerConnection | null;

}

export const webRTCSlice=createSlice({
    name:'webRTC',
    initialState:{
        sender:null,
        reciever: null
    } as iwebRTCSlice,
    reducers:{
        
    }
})

export const {} = webRTCSlice.actions
export const userReducer=webRTCSlice.reducer