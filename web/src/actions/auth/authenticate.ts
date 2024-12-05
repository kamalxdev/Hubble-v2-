"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/utils/prisma";

const SECRET = process.env.JWT_SECRET as string;

export default async function authenticate() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth");

    if (!authCookie?.value) {
      return { success: false, error: "User not logged in" };
    }

    const jwtVerifaction = await jwtVerify(
      authCookie?.value,
      new TextEncoder().encode(SECRET)
    );

    const isUser = await prisma.user.findUnique({
      where: { id: jwtVerifaction?.payload?.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
      },
    });
    if (!isUser) {
      cookieStore.delete("auth");
      return { success: false, error: "No user found" };
    }
    return { success: true, user: isUser };
  } catch (err) {
    console.log("Error on authenticationg user", err);
    
    return { success: false, error: "Invalid Authorization token" };
  }
}
