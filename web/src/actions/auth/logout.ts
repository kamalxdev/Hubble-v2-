'use server';

import { cookies } from "next/headers";

export default async function logOut(){
    try {
        const cookieStore = await cookies()
        cookieStore.delete('auth');
        return {success:true}
    } catch (error) {
        console.log("Error in logout: ",error);
        return {success:true,error:"Internal Server Error"}
        
    }
}