"use client";

import { memo, useRef, useState } from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "@/components/ui/button";
import { FileUploadRoot, FileUploadTrigger } from "@/components/ui/file-button";
import { HiUpload } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { FileUploadFileAcceptDetails } from "@chakra-ui/react";

import { FiEdit2 } from "react-icons/fi";
import { MdOutlineDone } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import uploadAvatar from "@/actions/user/avatar";
import { toaster } from "../ui/toaster";
import { ProgressCircleRing, ProgressCircleRoot } from "../ui/progress-circle";
import { setUser } from "@/redux/features/user";
import updateUser, { validateOTP } from "@/actions/user/update";
import { checkUnique } from "@/actions/user/user";
import sendEmailWithOTP from "@/utils/sendOTP";

function ProfileTemplate() {
  const [uploadedAvatar, setUploadedAvatar] = useState<File>();
  const [avatarUploadLoading, setAvatarUploadLoading] = useState(false);
  const dispatch = useAppDispatch();

  function handleOnFileAccept(event: FileUploadFileAcceptDetails) {
    const avatarfile = event?.files[0];
    if (avatarfile?.type == "image/png" || avatarfile?.type == "image/jpeg") {
      setUploadedAvatar(avatarfile);
    }
  }

  const editProfileDetails = [
    {
      title: "Name",
      defaultValue: useAppSelector((state) => state.user?.name),
    },
    {
      title: "Username",
      defaultValue: useAppSelector((state) => state.user?.username),
    },
    {
      title: "Email",
      defaultValue: useAppSelector((state) => state.user?.email),
    },
  ];
  const user = useAppSelector((state) => state.user);
  async function handleChangeAvatar() {
    if (!uploadAvatar)
      return toaster.create({
        title: "Please choose a file",
        type: "error",
      });

    setAvatarUploadLoading(true);

    const formData = new FormData();
    formData.set("avatar", uploadedAvatar as File);

    const avatar: { success: boolean; error?: string; avatar?: string } =
      await uploadAvatar(formData);

    if (!avatar?.success) {
      setAvatarUploadLoading(false);
      return toaster.create({
        title: avatar?.error,
        type: "error",
      });
    }
    if (avatar?.avatar) {
      dispatch(setUser({ ...user, avatar: avatar?.avatar }));
    }

    setAvatarUploadLoading(false);
    return toaster.create({
      title: "Your avatar has been successfully changed.",
      type: "success",
    });
  }

  return (
    <div className="flex flex-col justify-center gap-8">
      <div className="flex justify-center items-center gap-3">
        <Avatar
          name={useAppSelector((state) => state.user?.name)}
          loading="eager"
          src={
            (uploadedAvatar && URL.createObjectURL(uploadedAvatar)) ||
            user?.avatar ||
            undefined
          }
          className="flex justify-center items-center border border-black rounded-full w-36 h-36 overflow-hidden"
        />
        <form className="flex flex-col items-center justify-center gap-3">
          <FileUploadRoot
            accept={["image/png", "image/jpeg"]}
            allowDrop
            onFileAccept={handleOnFileAccept}
            name="avatar"
          >
            <FileUploadTrigger asChild>
              <Button className="border border-white/20 px-2 py-1" size="sm">
                <HiUpload /> Upload avatar
              </Button>
            </FileUploadTrigger>
          </FileUploadRoot>
          <button
            onClick={handleChangeAvatar}
            disabled={avatarUploadLoading}
            className={`relative px-3 py-1  text-black ${
              avatarUploadLoading ? "bg-white/10" : "hover:bg-white bg-white/70"
            } text-sm rounded-sm flex items-center justify-center flex-col`}
          >
            {avatarUploadLoading && (
              <ProgressCircleRoot
                value={null}
                size="xs"
                className="flex absolute justify-center items-center  p-2"
              >
                <ProgressCircleRing cap="round" />
              </ProgressCircleRoot>
            )}
            Update Avatar
          </button>
        </form>
      </div>
      <div className="flex flex-col gap-3">
        {editProfileDetails?.map(({ title, defaultValue }) => (
          <ProfileDetails
            title={title}
            defaultValue={defaultValue}
            key={title}
          />
        ))}
      </div>
    </div>
  );
}

type iProfileDetails = {
  title: string;
  defaultValue: string;
};

const ProfileDetails = memo(function ProfileDetails({
  title,
  defaultValue,
}: iProfileDetails) {
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const inputElement = useRef<HTMLInputElement>(null);
  async function handleSubmit() {
    if (toggleEdit) {
      if (value == defaultValue || !value) {
        if (inputElement?.current) {
          inputElement.current.value = defaultValue;
        }
        return setToggleEdit(false);
      }

      setLoading(true);

      function cleanupOnError() {
        setLoading(false);
        setToggleEdit(false);
        if (inputElement?.current) {
          inputElement.current.value = defaultValue;
        }
      }

      if (title == "Username") {
        const checkForUniqueUsername = await checkUnique({username:value});
        if (!checkForUniqueUsername?.success) {
          cleanupOnError();
          return toaster.create({
            title: checkForUniqueUsername?.error,
            type: "error",
          });
        }
        if (!checkForUniqueUsername?.unique) {
          cleanupOnError();
          return toaster.create({
            title: "Please choose a unique username",
            type: "error",
          });
        }
      }

      if (title == "Email") {
        const checkForUniqueEmail = await checkUnique({email:value});
        if (!checkForUniqueEmail?.success) {
          cleanupOnError();
          return toaster.create({
            title: checkForUniqueEmail?.error,
            type: "error",
          });
        }
        if (!checkForUniqueEmail?.unique) {
          cleanupOnError();
          return toaster.create({
            title: "Email already registered",
            type: "error",
          });
        }

        toaster.create({
          title: "Sending OTP to your Email",
          type: "info",
        });

        const emailSentToCurrentEmail = await sendEmailWithOTP(defaultValue);
        const emailSentToNewEmail = await sendEmailWithOTP(value);

        if (
          !emailSentToCurrentEmail?.success ||
          !emailSentToNewEmail?.success
        ) {
          return toaster.create({
            title: emailSentToNewEmail?.error || emailSentToCurrentEmail?.error,
            type: "error",
          });
        }

        toaster.create({
          title: "OTP sent successfully",
          type: "success",
        });

        const currentEmailOTP = prompt(`Enter OTP sent to ${defaultValue}`);
        if (!currentEmailOTP) {
          return cleanupOnError();
        }

        const newEmailOTP = prompt(`Enter OTP sent to ${value}`);
        if (!newEmailOTP) {
          return cleanupOnError();
        }

        const validatingSentOTP = await validateOTP(
          defaultValue,
          value,
          parseInt(currentEmailOTP),
          parseInt(newEmailOTP)
        );
        if(!validatingSentOTP?.success){
          return toaster.create({
            title: validatingSentOTP?.error,
            type: "error",
          });
        }
        toaster.create({
          title: "OTP validated Successfully",
          type: "success",
        });
      }

      const update = await updateUser({ [title.toLowerCase()]: value });

      if (!update?.success) {
        cleanupOnError();
        return toaster.create({
          title: update?.error,
          type: "error",
        });
      }
      setLoading(false);
      setToggleEdit(false);
      dispatch(setUser({ ...user, [title.toLowerCase()]: value }));
      return toaster.create({
        title: "Profile updated successfully",
        type: "success",
      });
    } else {
      setToggleEdit(true);
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full" key={title}>
      <p>{title}:</p>
      <span className="flex gap-2  rounded-sm w-full">
        <input
          type="text"
          disabled={!toggleEdit}
          defaultValue={defaultValue}
          ref={inputElement}
          onChange={(e) => setValue(e.target.value)}
          className={`outline-0 transition w-full h-full p-2 truncate  ${
            toggleEdit
              ? "border-b-4 border-green-700"
              : "border-2 border-white/25"
          }`}
        />
        <button
          type="button"
          className=" bg-white/20 p-2"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : toggleEdit ? (
            <MdOutlineDone />
          ) : (
            <FiEdit2 />
          )}
        </button>
      </span>
    </div>
  );
});

export default memo(ProfileTemplate);
