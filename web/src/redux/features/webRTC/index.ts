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
        initializeWebRTCpeers:(state)=>{
            state.sender=new RTCPeerConnection()
            state.reciever=new RTCPeerConnection()
        }
    }
})

export const {initializeWebRTCpeers} = webRTCSlice.actions
export const webRTCreducer=webRTCSlice.reducer