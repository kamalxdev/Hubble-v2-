"use server";

import { prisma } from "@/utils/prisma";
import authenticate from "../auth/authenticate";
import { selectDataforuser } from "@/libs/prismaSelect";

export default async function verifyCall(id:string) {
  try {
    const authenticateReq = await authenticate();
    if (!authenticateReq?.success)
      return { success: false, error: "You are not authorized" };

    if (!id) return { success: false};

    const call = await prisma.call.findUnique({
      where:{id},
      select: {
        id: true,
        caller:selectDataforuser
      },
    });

    if (!call) return { success: false};

    return { success: true, call };
    
  } catch (error) {
    console.log("Error on verifying a call: ", error);
    return { success: false, error: "Internal Server Error" };
  }
}
