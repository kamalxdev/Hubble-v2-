"use server";

import { prisma } from "@/utils/prisma";
import { client, startRedis } from "@/utils/redis";
import { loginSchema } from "@/utils/zodSchema";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT } from 'jose'
import { nanoid } from "nanoid";




const SECRET = process.env.JWT_SECRET as string;
type iLoginFormData = {
  email: string;
  password: string;
  OTP: number,
};
export async function validateFormData({
  email,
  password,
}: iLoginFormData) {
  try {
    // validating data using zod
    const validateSchema = loginSchema.safeParse({
      email,
      password,
    });

    // returning with errors got on validating body
    if (!validateSchema.success) {
      const errorMessages: { [key: string]: string } = {};
      (validateSchema?.error?.errors).map((e) => {
        errorMessages[e?.path[0]] = e?.message;
      });
      return { success: false, error: errorMessages };
    }
    
    // validating email
    const isUserValidated = await prisma.user.findUnique({
      where: {
        email
      },
      cacheStrategy: { ttl: 60 },
    });

    if (!isUserValidated)
      return {
        success: false,
        error: {email:"Cannot find user with this email"},
    };


    // validating password
    const comparePassword = bcrypt.compareSync(password, isUserValidated?.password);
    if(!comparePassword){        
        return {
            success: false,
            error: {password:"Incorrect Password"},
        }
    }


    return { success: true };
  } catch (error) {
    console.log("Error on Validating Form Data: ", error);
    return { success: false };
  }
}

export async function validateOTPandLoginUser(
  { email,OTP }: iLoginFormData
) {
  const cookieStore = await cookies()
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

    //login user
    
    const USER = await prisma.user.findUnique({
      where: {
        email
      },
      cacheStrategy: { ttl: 60 },
    });

    const token = await new SignJWT({id:USER?.id}).setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .sign(new TextEncoder().encode(SECRET))

    cookieStore.set('auth', token, { maxAge:31536000});

    return { success: true };
  } catch (error) {
    console.log("Error in validating otp and registering user: ", error);
    return { success: false, error: "Internal Server Error" };
  }
}
