"use client";

import { memo, useEffect, useState } from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-button";
import { HiUpload } from "react-icons/hi";
import { FileUploadFileAcceptDetails } from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineDone } from "react-icons/md";
import { useAppSelector } from "@/redux/hooks";
import uploadAvatar from "@/server-actions/user/avatar";
import { toaster } from "../ui/toaster";
import { revalidatePath } from "next/cache";

function ProfileTemplate() {
  
  const [uploadedAvatar, setUploadedAvatar] = useState<string>();

  function handleOnFileAccept(event: FileUploadFileAcceptDetails) {
    (event?.files[0]?.type == "image/png" ||
      event?.files[0]?.type == "image/jpeg") &&
      setUploadedAvatar(URL.createObjectURL(event.files[0]));


    // avatarData.append("avatar", event?.files[0]);
    // console.log("avatarData :",avatarData);  
  }

  const editProfileDetails = [
    {
      title: "Name",
      defaultValue: useAppSelector((state)=>state.user?.name),
    },
    {
      title: "Username",
      defaultValue: useAppSelector((state)=>state.user?.username),
    },
    {
      title: "Email",
      defaultValue: useAppSelector((state)=>state.user?.email),
    },
  ];
  const userAvatar= useAppSelector((state)=>state.user?.avatar)

  async function handleChangeAvatar(formData:FormData){
    console.log("formData : ",formData.get('avatar'))
    const avatar=await uploadAvatar(formData);
    if(!avatar?.success){
      toaster.create({
        title: avatar?.error,
        type: 'error',
      })
      return
    }
    toaster.create({
      title: "Your avatar has been successfully changed.",
      type: 'success',
    })
    // revalidatePath('/')
    return
  }

  return (
    <div className="flex flex-col justify-center gap-8">
      <div className="flex justify-center items-center gap-3">
        <Avatar
          name={useAppSelector((state)=>state.user?.name)}
          loading="eager"
          src={uploadedAvatar || userAvatar || undefined}
          className="flex justify-center items-center border border-black rounded-full w-36 h-36 overflow-hidden"
        />
        <form action={handleChangeAvatar} className="flex flex-col items-center justify-center gap-3">
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
        <button type="submit" className="px-3 py-1 bg-white/80 text-black hover:bg-white text-sm rounded-sm">Update Avatar</button>
        </form>
      </div>
      <div className="flex flex-col gap-3">
        {editProfileDetails?.map(({ title, defaultValue }) => (
          <ProfileDetails title={title} defaultValue={defaultValue} key={title} />
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
  return (
    <div className="flex flex-col gap-2 w-full" key={title}>
      <p>{title}:</p>
      <span className="flex gap-2  rounded-sm w-full">
        <input
          type="text"
          name=""
          id=""
          disabled={!toggleEdit}
          defaultValue={defaultValue}
          className={`outline-0 transition w-full h-full p-2 truncate  ${
            toggleEdit
              ? "border-b-4 border-green-700"
              : "border-2 border-white/25"
          }`}
        />
        <button
          type="button"
          className=" bg-white/20 p-2"
          onClick={() => setToggleEdit(!toggleEdit)}
        >
          {toggleEdit ? <MdOutlineDone /> : <FiEdit2 />}
        </button>
      </span>
    </div>
  );
});

export default memo(ProfileTemplate);
