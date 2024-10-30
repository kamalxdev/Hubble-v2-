"use client";

import { Button, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { PinInput } from "@/components/ui/pin-input";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    OTP: "",
    username: "",
    password: "",
  });
  const [OTPsent, setOTPsent] = useState(false);
  const [formError, setFormError] = useState({
    name: "",
    email: "",
    OTP: "",
    username: "",
    password: "",
  });
  function handleRegisterBtn() {
    setOTPsent(true)
  }
  return (
    <section className="bg-black w-screen h-dvh text-white flex justify-center items-center    ">
      <Stack
        gap="4"
        align="flex-start"
        className="w-4/12 p-10 shadow-2xl shadow-white/10 "
      >
        {OTPsent ? (
          <>
            <span className="flex flex-col w-full justify-center items-center">
              <h1 className="text-2xl font-bold">Enter OTP</h1>
              <p className="text-white/50">
                OTP has been shared to your email{" "}
                <i className="border-b border-white font-semibold text-white">
                  {formData?.email}
                </i>
              </p>
            </span>
            <PinInput className="flex justify-center items-center w-full" />
            <Button
              type="button"
              className="bg-white/90 text-black w-full hover:bg-white rounded-md"
            >
              Submit
            </Button>
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
            <Field label={"Name"} invalid={false} errorText={formError?.name}>
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
              invalid={false}
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
            <Field label={"Email"} invalid={false} errorText={formError?.email}>
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
              invalid={false}
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
            <Button
              type="button"
              onClick={handleRegisterBtn}
              className="bg-white/90 text-black w-full hover:bg-white rounded-md"
            >
              Register
            </Button>{" "}
          </>
        )}
      </Stack>
    </section>
  );
}
