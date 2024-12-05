"use client";

import { Button, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { PinInput } from "@/components/ui/pin-input";
import {
  validateFormData,
  validateOTPandLoginUser,
} from "@/actions/auth/login";
import {
  ProgressCircleRing,
  ProgressCircleRoot,
} from "@/components/ui/progress-circle";
import sendEmailWithOTP from "@/utils/sendOTP";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

type iFormError = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
};

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    OTP: 0,
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [OTPsent, setOTPsent] = useState(false);
  const [formError, setFormError] = useState<iFormError>({});
  async function handleLoginBtn() {
    if (!formData?.email || !formData?.password) {
      return toaster.create({
        title: "Please fill all the fields to continue",
        type: "error",
      });
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
        type: "error",
      });
    }
    setLoading(false);
    setOTPsent(true);

    return toaster.create({
      title: "OTP sent successfully",
      type: "success",
    });
  }
  async function handleSubmitBtn() {
    setLoading(true);
    const loginUser = await validateOTPandLoginUser(formData);
    if (!loginUser?.success) {
      setLoading(false);
      return toaster.create({
        title: loginUser?.error,
        type: "error",
      });
    }
    setLoading(true);
    router.push("/");
    return toaster.create({
      title: "User logged in successfully",
      type: "success",
    });
  }
  return (
    <section className="bg-black w-screen h-dvh text-white flex justify-center items-center">
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
            <PinInput
              className="flex justify-center items-center w-full"
              otp
              autoFocus
              onValueChange={(e) =>
                setFormData({ ...formData, OTP: parseInt(e.valueAsString) })
              }
            />
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
                onClick={handleSubmitBtn}
                className="bg-white/90 text-black w-full hover:bg-white rounded-md"
              >
                Submit
              </Button>
            )}
          </>
        ) : (
          <>
            <span className="flex flex-col w-full justify-center items-center">
              <h1 className="text-2xl font-bold">Log in to your account</h1>
              <p className="text-white/50 text-nowrap text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="border-b border-white font-semibold text-white"
                >
                  Create a free account
                </Link>
              </p>
            </span>
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
                onClick={handleLoginBtn}
                className="bg-white/90 text-black w-full hover:bg-white rounded-md"
              >
                Login
              </Button>
            )}
          </>
        )}
      </Stack>
    </section>
  );
}
