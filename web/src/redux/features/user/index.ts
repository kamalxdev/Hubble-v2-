import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type iUser={
    name: string;
    id: string;
    avatar: string | null;
    username: string;
    email: string;
}

export const userSlice=createSlice({
    name:'user',
    initialState:{
        id:'',
        name:'',
        avatar:null,
        username:'',
        email:''
    } as iUser,
    reducers:{
        setUser:(state,action:PayloadAction<iUser>)=>{
            let {id,name,avatar,username,email}=action.payload;
            state.id=id;
            state.name=name;
            state.email=email;
            state.avatar=avatar || '';
            state.username=username;
        }
    }
})

export const {setUser} = userSlice.actions
export const userReducer=userSlice.reducer