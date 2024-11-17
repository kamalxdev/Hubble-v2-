"use server";

import { prisma } from "@/utils/prisma";
import authenticate from "../auth/authenticate";
import { selectDataforuser } from "@/libs/prismaSelect";

export default async function getCallHistory(id: string) {
  try {
    const authenticateReq = await authenticate();
    if (!authenticateReq?.success)
      return { success: false, error: "You are not authorized" };

    if (!id) return { success: false };

    const history = await prisma.call.findMany({
      where: {
        OR: [
          {
            callerId: id,
          },
          {
            receiverId: id,
          },
        ],
      },
      select: {
        id: true,
        answer:true,
        type:true,
        createdAt:true,
        caller: selectDataforuser,
        receiver: selectDataforuser,
      },
    });

    if (!history) return { success: false };

    let filteredHistory = history?.map((h) => {
      if (h?.caller?.id == id) {
        return {
          ...h,
          caller: undefined,
          createdAt:h?.createdAt?.toISOString()
        };
      } else {
        return {
          ...h,
          receiver: undefined,
          createdAt:h?.createdAt?.toISOString()
        };
      }
    });

    return { success: true, history: filteredHistory };
  } catch (error) {
    console.log("Error on getting call History: ", error);
    return { success: false, error: "Internal Server Error" };
  }
}
