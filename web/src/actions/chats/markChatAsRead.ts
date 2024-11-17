"use server";

import { prisma } from "@/utils/prisma";
import authenticate from "../auth/authenticate";
import { Prisma } from "@prisma/client/edge";
import { iMessages } from "@/types/chats";


export default async function markChatasRead(friendID: string) {
  try {
    const authenticateReq = await authenticate();
    if (!authenticateReq?.success)
      return { success: false, error: "You are not authorized" };

    const chat = await prisma.chat.findFirst({
      where: {
        OR: [
          {
            senderId: authenticateReq?.user?.id,
            receiverId: friendID,
          },
          {
            senderId: friendID,
            receiverId: authenticateReq?.user?.id,
          },
        ],
      },
    });

    if (!chat) return { success: false, error: "No Chat found" };

    const updatedMessages = (chat?.messages as Prisma.JsonArray)?.map((m) => {
      return { ...(m as iMessages), status: "read" };
    });

    const updateChatStatus = await prisma.chat.update({
      where: {
        id: chat?.id,
      },
      data: {
        messages: updatedMessages,
      },
    });
    if (!updateChatStatus)
      return { success: false, error: "Error on updating chats" };

    return { success: true };
  } catch (error) {
    console.log("Error on Mrking chat as read: ", error);
    return { success: false, error: "Internal Server Error" };
  }
}
