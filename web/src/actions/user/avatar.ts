"use server";

import { deleteFile, getFile, upload } from "@/utils/cloudinary";
import authenticate from "../auth/authenticate";
import { prisma } from "@/utils/prisma";
import { UploadApiResponse } from "cloudinary";

export default async function uploadAvatar(avatar: FormData) {
  try {
    if ((avatar.get("avatar") as File).size == 0) {
      return { error: "Avatar path is required", success: false };
    }
    const authenticateReq = await authenticate();
    if (!authenticateReq?.success) return authenticateReq;

    // uploading avatar to cloudinary
    const upload_avatar = (await upload(avatar)) as UploadApiResponse;

    if (!upload_avatar?.secure_url) {
      return { success: false, error: "Error in Uploading avatar" };
    }

    // deleting the previous avatar, if any
    authenticateReq?.user?.avatar &&
      (await deleteFile(authenticateReq?.user?.avatar));

    const avatar_optimize_url = await getFile(upload_avatar?.public_id);
    const updated_avatar_on_DB = await prisma.user.update({
      where: {
        id: authenticateReq?.user?.id,
      },
      data: {
        avatar: avatar_optimize_url,
      },
    });
    if (!updated_avatar_on_DB)
      return {
        error: "Error on updating in database",
        success: false,
      };
    return { avatar: avatar_optimize_url, success: true };
  } catch (error) {
    console.log("Error from updating avatar: ", error);
    return { success: false, error: "Internal Server Error" };
  }
}
