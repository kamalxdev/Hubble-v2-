"use server";

import { generateOTP } from "@/libs/generateOTP";
import { transporter } from "./nodemailer";
import { client, startRedis } from "./redis";

async function emailOTP(to: string, otp: any) {
  try {
    const info = await transporter.sendMail({
      from: `"Hubble" <${process.env.EMAIL_ID}>`,
      to,
      subject: "OTP to authenticate your account",
      text: `Your OTP to verify your email is ${otp}`,
      html: `
  <body style="margin: 0; padding: 0; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7fa; padding: 20px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" width="100%" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); padding: 20px;">
            <tr>
              <td align="center" style="padding: 10px;">
                <h1 style="font-size: 22px; font-family: Arial, sans-serif; color: #333333; margin: 0; padding-bottom: 10px;">OTP Verification</h1>
                <p style="font-size: 16px; font-family: Arial, sans-serif; color: #555555; margin: 0 0 20px;">We have sent a One-Time Password (OTP) to your registered email. Enter the code below to verify your identity:</p>
  
                <div style="font-size: 24px; font-family: Arial, sans-serif; letter-spacing: 4px; color: #007bff; background-color: #f4f7fa; border: 1px dashed #007bff; border-radius: 5px; padding: 10px; display: inline-block;">
                  ${otp}
                </div>
  
                <p style="font-size: 12px; font-family: Arial, sans-serif; color: #777777; margin-top: 20px;">If you did not request this, please ignore this message.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  
        `,
    });
    return { success: true, info };
  } catch (error) {
    console.log("Error on sending email: ", error);
    return { success: false, error: "Error on sending OTP" };
  }
}

// Sends email with otp and stores otp in redis
export default async function sendEmailWithOTP(email: string) {
  try {
    await startRedis();
    const otp = generateOTP();

    await client.set(`OTP:${email}`, otp);
    const get_stored_otp_from_redis = await client.get(`OTP:${email}`);
    if (!get_stored_otp_from_redis) {
      return { success: false, error: "Failed to generate OTP" };
    }

    const mail = await emailOTP(email, get_stored_otp_from_redis);

    if (!mail.success) {
      return { success: false, error: "Error in sending mail" };
    }
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.log("Error in generating OTP and sending mail: ", error);
    return { success: false, error: "Internal server error" };
  }
}
