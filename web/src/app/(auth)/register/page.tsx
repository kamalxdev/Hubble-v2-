"use client";

import { Button, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { PinInput } from "@/components/ui/pin-input";
import { validateFormData, validateOTPandRegisterUser } from "@/actions/auth/register";
import {
  ProgressCircleRing,
  ProgressCircleRoot,
} from "@/components/ui/progress-circle";
import sendEmailWithOTP from "@/utils/sendOTP";
import { toaster } from "@/components/ui/toaster"
import { useRouter } from 'next/navigation'


type iFormError = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
};

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    OTP:0,
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [OTPsent, setOTPsent] = useState(false);
  const [formError, setFormError] = useState<iFormError>({});
  async function handleRegisterBtn() {
    if(!formData?.name || !formData?.email || !formData?.password || !formData?.username){
      return toaster.create({
        title: "Please fill all the fields to continue",
        type: 'error',
      })
    }
    setLoading(true);
    const validateData = await validateFormData(formData);
    if (!validateData.success) {
      setLoading(false);
      return setFormError({ ...validateData?.error });
    }
    const emailSent = await sendEmailWithOTP(formData?.email);
    if (!emailSent.success) {
      setLoading(false);
      return toaster.create({
        title: emailSent?.error,
        type: 'error',
      })
    }
    setLoading(false);
    setOTPsent(true);

    return toaster.create({
      title: "OTP sent successfully",
      type: 'success',
    })
  }
  async function handleSubmitBtn(){
    setLoading(true);
    const registerUser=await validateOTPandRegisterUser(formData);
    if(!registerUser?.success){
    setLoading(false);
      return toaster.create({
        title: registerUser?.error,
        type: 'error',
      })
    }
    setLoading(false);
    router.push('/login')
    return toaster.create({
      title: "User registered successfully",
      type: 'success',
    })
  }
  return (
    <section className="bg-black w-screen h-dvh text-white flex justify-center items-center    ">
      <Stack gap="4" align="flex-start" className="md:w-4/12 p-10">
        {OTPsent ? (
          <>
            <span className="flex flex-col w-full justify-center items-center">
              <h1 className="text-2xl font-bold">Enter OTP</h1>
              <p className="text-white/50 text-center">
                OTP has been shared to your email{" "}
                <i className="border-b border-white font-semibold text-white">
                  {formData?.email}
                </i>
              </p>
            </span>
            <PinInput className="flex justify-center items-center w-full" otp autoFocus onValueChange={(e)=>setFormData({...formData,OTP:parseInt(e.valueAsString)})}/>
            {loading ? (
              <ProgressCircleRoot
                value={null}
                size="sm"
                className="w-full flex justify-center items-center"
              >
                <ProgressCircleRing cap="round" />
              </ProgressCircleRoot>
            ) :<Button
              type="button"
              onClick={handleSubmitBtn}
              className="bg-white/90 text-black w-full hover:bg-white rounded-md"
            >
              Submit
            </Button>}
          </>
        ) : (
          <>
            <span className="flex flex-col w-full justify-center items-center">
              <h1 className="text-2xl font-bold">Register to create account</h1>
              <p className="text-white/50">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="border-b border-white font-semibold text-white"
                >
                  Login
                </Link>
              </p>
            </span>
            <Field
              label={"Name"}
              invalid={formError?.name ? true : false}
              errorText={formError?.name}
            >
              <Input
                type="text"
                required
                className="border-2 border-white/15 px-3"
                placeholder="John Doe"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Field>
            <Field
              label={"Username"}
              invalid={formError?.username ? true : false}
              errorText={formError?.username}
            >
              <Input
                type="text"
                required
                className="border-2 border-white/15 px-3"
                placeholder="doe"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </Field>
            <Field
              label={"Email"}
              invalid={formError?.email ? true : false}
              errorText={formError?.email}
            >
              <Input
                type="email"
                required
                placeholder="john@example.com"
                className="border-2 border-white/15 px-3"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Field>
            <Field
              label={"Password"}
              invalid={formError?.password ? true : false}
              errorText={formError?.password}
            >
              <PasswordInput
                required
                className="border-2 border-white/15 px-3"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Field>
            {loading ? (
              <ProgressCircleRoot
                value={null}
                size="sm"
                className="w-full flex justify-center items-center"
              >
                <ProgressCircleRing cap="round" />
              </ProgressCircleRoot>
            ) : (
              <Button
                type="button"
                onClick={handleRegisterBtn}
                className="bg-white/90 text-black w-full hover:bg-white rounded-md"
              >
                Register
              </Button>
            )}
          </>
        )}
      </Stack>
    </section>
  );
}
