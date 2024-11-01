"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/utils/prisma";

const SECRET = process.env.JWT_SECRET as string;

export default async function authenticate() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth");

  if (!authCookie?.value) {
    return { success: false, error: "User not logged in" };
  }

  return await jwtVerify(authCookie?.value, new TextEncoder().encode(SECRET))
    .then(async ({ payload }) => {
      const isUser = await prisma.user.findUnique({
        where: { id: payload.id as string },
      });
      if (!isUser) {
        cookieStore.delete("auth");
        return { success: false, error: "No user found" };
      }
      return { success: true };
    })
    .catch(() => {
      return { success: false, error: "Invalid Authorization token" };
    });
}
