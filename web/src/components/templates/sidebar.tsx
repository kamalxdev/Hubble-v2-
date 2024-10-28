"use client";

import { memo } from "react";
import { Avatar } from "../ui/avatar";
import { IconButton } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { PiChatText } from "react-icons/pi";
import { MdOutlineCall } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";

function SidebarTemplate() {
  const menu = [
    {
      label: "Search",
      icon: <LuSearch />,
      onclick: () => {
        alert("label");
      },
    },
    {
      label: "Messages",
      icon: <PiChatText />,
      onclick: () => {
        alert("label");
      },
    },
    {
      label: "Calls",
      icon: <MdOutlineCall />,
      onclick: () => {
        alert("label");
      },
    },
  ];
  return (
    <section className="flex flex-col bg-slate-950  h-dvh items-center justify-between text-white px-2">
      <div className="flex flex-col mt-6 gap-5 ">
        <div>
          <Avatar
            name="Kamal Singh"
            loading="lazy"
            onClick={() => alert("Hello World")}
          />
        </div>
        <div className="flex flex-col gap-1">
          {menu?.map(({ label, icon, onclick }) => (
            <IconButton
              aria-label={label}
              key={label}
              className="hover:bg-slate-900"
              onClick={onclick}
            >
              {icon}
            </IconButton>
          ))}
        </div>
      </div>
      <div className="mb-14">
        <IconButton aria-label={"Setting"} className="hover:bg-slate-900">
          <IoSettingsOutline />
        </IconButton>
      </div>
    </section>
  );
}

export default memo(SidebarTemplate);
