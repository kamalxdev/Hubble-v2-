"use server";

import { prisma } from "@/utils/prisma";

export default async function getUser(id: string) {
  try {
    if (!id) return { success: false };
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        name: true,
        avatar: true,
        id: true,
        username: true,
      },
    });
    if(!user) return {success:false,error:"No user found"}
    return { success: true, user };
  } catch (error) {
    console.log("Error on getting user: ", error);
    return { success: false, error: "Internal Server Error" };
  }
}
