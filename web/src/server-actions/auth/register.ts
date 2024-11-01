"use server";

import { prisma } from "@/utils/prisma";
import { client, startRedis } from "@/utils/redis";
import { registerSchema } from "@/utils/zodSchema";
import bcrypt from "bcryptjs";

type iRegisterFormData = {
  name: string;
  username: string;
  email: string;
  password: string;
  OTP: number,
};
export async function validateFormData({
  name,
  username,
  email,
  password,
}: iRegisterFormData) {
  try {
    // validating data using zod
    const validateSchema = registerSchema.safeParse({
      email,
      name,
      username,
      password,
    });

    // returning with errors got on validating body
    if (!validateSchema.success) {
      let errorMessages: { [key: string]: string } = {};
      (validateSchema?.error?.errors).map((e) => {
        errorMessages[e?.path[0]] = e?.message;
      });
      return { success: false, error: errorMessages };
    }

    // checking if username is unique
    const isUsernamePresent = await prisma.user.findFirst({
      where: {
        username,
      },
      cacheStrategy: { ttl: 60 },
    });
    if (isUsernamePresent)
      return {
        success: false,
        error: { username: "Please choose a unique username" },
      };

    // checking if email is unique
    const isEmailpresent = await prisma.user.findFirst({
      where: {
        email,
      },
      cacheStrategy: { ttl: 60 },
    });
    if (isEmailpresent)
      return {
        success: false,
        error: { email: "An account with this email is present" },
      };

    return { success: true };
  } catch (error) {
    console.log("Error on Validating Form Data: ", error);
    return { success: false };
  }
}

export async function validateOTPandRegisterUser(
  { email, name, username, password,OTP }: iRegisterFormData
) {
  try {
    await startRedis();
    if (!OTP) return { success: false, error: "OTP is required" };

    const otp_stored_on_redis = await client.get(`OTP:${email}`);

    if (!otp_stored_on_redis) return { success: false, error: "OTP not found" };

    if (parseInt(otp_stored_on_redis) != OTP) {
      return {
        success: false,
        error: `OTP does not match`,
      };
    }

    // hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await  prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username,
      },
    });
    
    if (!user) {
      return { success: false, error: `Error on creating a account` };
    }
    return { success: true };
  } catch (error) {
    console.log("Error in validating otp and registering user: ", error);
    return { success: false, error: "Internal Server Error" };
  }
}
