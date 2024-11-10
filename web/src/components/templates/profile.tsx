"use client";

import { memo, useEffect, useState } from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "@/components/ui/button";
import { FileUploadRoot, FileUploadTrigger } from "@/components/ui/file-button";
import { HiUpload } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import {
  Box,
  Center,
  FileUploadFileAcceptDetails,
  Spinner,
} from "@chakra-ui/react";

import { FiEdit2 } from "react-icons/fi";
import { MdOutlineDone } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import uploadAvatar from "@/server-actions/user/avatar";
import { toaster } from "../ui/toaster";
import { ProgressCircleRing, ProgressCircleRoot } from "../ui/progress-circle";
import { setUser } from "@/redux/features/user";
import updateUser from "@/server-actions/user/update";

function ProfileTemplate() {
  const [uploadedAvatar, setUploadedAvatar] = useState<File>();
  const [avatarUploadLoading, setAvatarUploadLoading] = useState(false);
  const dispatch = useAppDispatch();

  function handleOnFileAccept(event: FileUploadFileAcceptDetails) {
    (event?.files[0]?.type == "image/png" ||
      event?.files[0]?.type == "image/jpeg") &&
      setUploadedAvatar(event.files[0]);
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
  // useEffect(()=>{console.log("avatarUploadLoading: ",avatarUploadLoading);
  // },[avatarUploadLoading])
  async function handleChangeAvatar() {    
    if(!uploadAvatar) return toaster.create({
      title: "Please choose a file",
      type: "error",
    });

    setAvatarUploadLoading(true);

    let formData= new FormData();
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
    avatar?.avatar && dispatch(setUser({ ...user, avatar: avatar?.avatar }));

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
          src={(uploadedAvatar && URL.createObjectURL(uploadedAvatar)) || user?.avatar || undefined}
          className="flex justify-center items-center border border-black rounded-full w-36 h-36 overflow-hidden"
        />
        <form
          className="flex flex-col items-center justify-center gap-3"
        >
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
  const [value, setValue] = useState<string>("");
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  async function handleSubmit() {
    if(toggleEdit){
      if(value==defaultValue) return setToggleEdit(false)
      setLoading(true);
      const update = await updateUser({ [title.toLowerCase()]: value });
      if (!update?.success) {
        setLoading(false);
        return toaster.create({
          title: update?.error,
          type: "error",
        });
      }
      setLoading(false);
      setToggleEdit(false)
      dispatch(setUser({...user,[title.toLowerCase()]: value }))
      return toaster.create({
        title: "Profile updated successfully",
        type: "success",
      });
    }else {
      setToggleEdit(true)
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
