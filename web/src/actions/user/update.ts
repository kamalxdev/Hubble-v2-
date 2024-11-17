"use server";

import { prisma } from "@/utils/prisma";
import authenticate from "../auth/authenticate";

export default async function updateUser(update: {}) {
  try {
    if (!update) return { success: false };

    const authenticateReq = await authenticate();
    if (!authenticateReq?.success) return {success:false,error:"You are not authorized"}

    const updatedUser = await prisma.user.update({
      where: {
        id:authenticateReq?.user?.id
      },
      data:update,
      select:{
        name: true,
        avatar: true,
        id: true,
        username: true,
      }
    });
    if(!updateUser) return {success:false,error:"Failed to update user"}
    return { success: true, user: updatedUser };
  } catch (error) {
    console.log("Error on updating user: ", error);

    return { success: false, error: "Internal Server Error" };
  }
}
