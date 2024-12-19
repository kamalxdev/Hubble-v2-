"use server";

import { prisma } from "@/utils/prisma";
import authenticate from "../auth/authenticate";
import { Prisma } from "@prisma/client/edge";
import { client } from "@/utils/redis";

export default async function updateUser(update: Prisma.UserUpdateInput) {
  try {
    if (!update) return { success: false };

    const authenticateReq = await authenticate();
    if (!authenticateReq?.success)
      return { success: false, error: "You are not authorized" };

    const updatedUser = await prisma.user.update({
      where: {
        id: authenticateReq?.user?.id,
      },
      data: update,
      select: {
        name: true,
        avatar: true,
        id: true,
        username: true,
      },
    });
    if (!updateUser) return { success: false, error: "Failed to update user" };
    return { success: true, user: updatedUser };
  } catch (error) {
    console.log("Error on updating user: ", error);

    return { success: false, error: "Internal Server Error" };
  }
}

export async function validateOTP(
  currentEmail: string,
  newEmail: string,
  currentOTP: number,
  newOTP: number
) {
  try {
    if (!currentOTP || !newOTP) {
      return { success: false, error: "No OTP found" };
    }

    const currentStoredOTP = await client.get(`OTP:${currentEmail}`);
    const newStoredOTP = await client.get(`OTP:${newEmail}`);

    if (!currentStoredOTP || !newStoredOTP) return { success: false, error: "OTP not found" };

    if (parseInt(currentStoredOTP) == currentOTP && parseInt(newStoredOTP) == newOTP ) {
      return {
        success: true,
      };
    }
    return {
      success: false,
      error: `OTP does not match`,
    };
  } catch (error) {
    console.log("Error on validating OTP user: ", error);

    return { success: false, error: "Internal Server Error" };
  }
}
