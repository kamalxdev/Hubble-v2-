"use server";

import { prisma } from "@/utils/prisma";
import authenticate from "../auth/authenticate";

export async function getFriends() {
  try {
    const authenticateReq = await authenticate();
    if (!authenticateReq?.success) return authenticateReq;

    const friends = await prisma.user.findUnique({
      where: { id: authenticateReq?.user?.id },
      select: {
        id:true,
        chatsSent: true,
        chatsReceived: true,
      },
    });

    return { success: true, friends };
  } catch (error) {
    console.log("Error on getFriends: ",error);
    return { success: true, error:"Internal Server Error" };

    
  }
}
