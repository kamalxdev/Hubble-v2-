"use client";

import { memo, useState } from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-button";
import { HiUpload } from "react-icons/hi";
import { FileUploadFileAcceptDetails, Input } from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineDone } from "react-icons/md";

function ProfileTemplate() {
  const [uploadedAvatar, setUploadedAvatar] = useState<string>();

  function handleOnFileAccept(event: FileUploadFileAcceptDetails) {
    // let avaterData = new FormData();
    // avaterData.append("avatar", event?.acceptedFiles[0]);
    (event?.files[0]?.type == "image/png" ||
      event?.files[0]?.type == "image/jpeg") &&
      setUploadedAvatar(URL.createObjectURL(event.files[0]));
  }

  const editProfileDetails = [
    {
      title: "Name",
      defaultValue: "Kamal Singh",
    },
    {
      title: "Username",
      defaultValue: "ksb",
    },
    {
      title: "Email",
      defaultValue: "itskamal.dev@gmail.com",
    },
  ];
  return (
    <div className="flex flex-col justify-center gap-8">
      <div className="flex justify-center items-center gap-3">
        <Avatar
          name="Kamal Singh"
          loading="eager"
          src={uploadedAvatar}
          className="flex justify-center items-center border border-black rounded-full w-36 h-36 overflow-hidden"
        />
        <FileUploadRoot
          accept={["image/png", "image/jpeg"]}
          onFileAccept={handleOnFileAccept}
        >
          <FileUploadTrigger asChild>
            <Button className="border border-white/20 px-2 py-1" size="sm">
              <HiUpload /> Upload avatar
            </Button>
          </FileUploadTrigger>
          <FileUploadList />
        </FileUploadRoot>
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
        {/* <Input disabled={false} defaultValue={"Kamal Singh"} className={`outline-0 border-0 transition p-0 ${toggleEdit && "border-b-4 border-green-700"}`}/> */}
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
