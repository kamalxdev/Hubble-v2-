"use server";

import { iMessages } from "@/types/chats";
import { prisma } from "@/utils/prisma";
import { Prisma } from "@prisma/client/edge";

type istoreMessages = {
  sender: string;
  reciever: string;
  message: iMessages;
};

export default async function storeMessages({
  sender,
  reciever,
  message,
}: istoreMessages) {
  try {
    const isChat = await prisma.chat.findFirst({
      where: {
        OR: [
          {
            senderId: sender,
            receiverId: reciever,
          },
          {
            senderId: reciever,
            receiverId: sender,
          },
        ],
      },
    });

    if (isChat) {
      (isChat?.messages as Prisma.JsonArray).push(message);
    }

    const chat = await prisma.chat.upsert({
      where: {
        id: isChat?.id || ''
      },
      update: {
        messages: isChat?.messages as Prisma.JsonArray,
      },
      create: {
        messages: [message],
        senderId: sender,
        receiverId: reciever,
      },
    });

    if (!chat) return { success: false, error: "Error on storing chats" };
    return { success: true };
  } catch (error) {
    console.log("Error on Storing Messages: ", error);

    return { success: false, error: "Internal Server Error" };
  }
}
