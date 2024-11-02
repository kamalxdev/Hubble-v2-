"use client";

import { memo, useEffect } from "react";
import { Avatar } from "../ui/avatar";
import { IconButton } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { PiChatText } from "react-icons/pi";
import { IoCallOutline, IoSettingsOutline } from "react-icons/io5";
import Drawer from "./drawer";
import SearchbarTemplate from "./searchbar";
import ProfileTemplate from "./profile";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import authenticate from "@/server-actions/auth/authenticate";
import { iUser, setUser } from "@/redux/features/user";
import SettingTemplate from "./setting";

function SidebarTemplate() {
  const dispatch=useAppDispatch();
  useEffect(()=>{
    authenticate().then((data:{success:boolean,user?:iUser})=>{
      dispatch(setUser(data?.user as iUser));
    })
  },[])
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
          icon={<Avatar name={useAppSelector((state)=>state.user?.name)} loading="lazy" />}
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
          <SettingTemplate/>
        </Drawer>
      </div>
    </section>
  );
}

export default memo(SidebarTemplate);
