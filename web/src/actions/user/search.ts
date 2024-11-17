"use server";

import { prisma } from "@/utils/prisma";

export default async function searchUser(query: string) {
  try {
    if (!query) return { success: false };
    const searchResult = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },

          {
            username: {
              startsWith: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        name: true,
        avatar: true,
        id: true,
        username: true,
      },
    });
    return { success: true, result: searchResult };
  } catch (error) {
    console.log("Error on SearchResult: ", error);

    return { success: false, error: "Internal Server Error" };
  }
}
