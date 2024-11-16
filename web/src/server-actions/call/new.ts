"use server";

import { prisma } from "@/utils/prisma";
import authenticate from "../auth/authenticate";

export default async function newCall(to:string, type: "video" | "voice") {
  try {
    const authenticateReq = await authenticate();
    if (!authenticateReq?.success)
      return { success: false, error: "You are not authorized" };

    if (!to || !type) return { success: false, error: "Incomplete information" };

    const call = await prisma.call.create({
      data: {
        callerId: authenticateReq?.user?.id as string,
        receiverId: to,
        type,
      },
      select: {
        id: true,
      },
    });

    if (!call) return { success: false, error: "Error on creating a call" };

    return { success: true, call };
  } catch (error) {
    console.log("Error on creating new call: ", error);
    return { success: false, error: "Internal Server Error" };
  }
}
