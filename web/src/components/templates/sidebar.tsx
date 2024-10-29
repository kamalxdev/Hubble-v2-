"use client";

import { memo } from "react";
import { Avatar } from "../ui/avatar";
import { IconButton } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { PiChatText } from "react-icons/pi";
import { IoCallOutline, IoSettingsOutline } from "react-icons/io5";
import Drawer from "./drawer";
import SearchbarTemplate from "./searchbar";
import ProfileTemplate from "./profile";

function SidebarTemplate() {
  const menu = [
    {
      label: "Messages",
      icon: <PiChatText />,
      onclick: () => {
        alert("label");
      },
    },
    {
      label: "Calls",
      icon: <IoCallOutline />,
      onclick: () => {
        alert("label");
      },
    },
  ];
  return (
    <section className="flex flex-col bg-slate-950 h-dvh items-center justify-between text-white px-2">
      <div className="flex flex-col mt-6 gap-5 ">
        <Drawer
          title="Profile"
          icon={<Avatar name="Kamal Singh" loading="lazy" />}
        >
          <ProfileTemplate />
        </Drawer>
        <div className="flex flex-col gap-1">
          <Drawer title="Search" icon={<LuSearch />}>
            <SearchbarTemplate />
          </Drawer>
          {menu?.map(({ label, icon, onclick }) => (
            <IconButton
              aria-label={label}
              key={label}
              className="transition hover:bg-slate-900"
              onClick={onclick}
            >
              {icon}
            </IconButton>
          ))}
        </div>
      </div>
      <div className="mb-14">
        <Drawer title="Setting" icon={<IoSettingsOutline />}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Drawer>
      </div>
    </section>
  );
}

export default memo(SidebarTemplate);
