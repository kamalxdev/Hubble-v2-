"use server";

import { prisma } from "@/utils/prisma";
import authenticate from "../auth/authenticate";

export default async function setCallAnswered(id:string) {
  try {
    const authenticateReq = await authenticate();
    if (!authenticateReq?.success)
      return { success: false, error: "You are not authorized" };

    if (!id) return { success: false};

    const call = await prisma.call.update({
      where:{id},
      data:{
        answer:true
      }
    });

    if (!call) return { success: false};

    return { success: true };
    
  } catch (error) {
    console.log("Error on setting call answered: ", error);
    return { success: false, error: "Internal Server Error" };
  }
}
