"use server";

import { prisma } from "@/utils/prisma";
import authenticate from "../auth/authenticate";

export async function getFriends() {
  try {
    const authenticateReq = await authenticate();
    if (!authenticateReq?.success) return {success:false,error:"User not authorized"};

    let selectDataforuser = {
      select: {
        name: true,
        username: true,
        id: true,
        avatar: true,
      },
    };

    const friends = await prisma.user.findUnique({
      where: { id: authenticateReq?.user?.id },
      select: {
        id: true,
        chatsSent: {
          select: {
            receiver: selectDataforuser,
            messages: true,
          },
        },
        chatsReceived: {
          select: {
            sender: selectDataforuser,
            messages: true,
          },
        },
      },
    });

    const allFriends = [
      ...(friends?.chatsReceived?.map((f) => {
        return {
          detail: f?.sender,
          messages: f?.messages,
        };
      }) || []),
      ...(friends?.chatsSent?.map((f) => {
        return {
          detail: f?.receiver,
          messages: f?.messages,
        };
      }) || []),
    ];

    return { success: true, friends: allFriends };
  } catch (error) {
    console.log("Error on getFriends: ", error);
    return { success: true, error: "Internal Server Error" };
  }
}
