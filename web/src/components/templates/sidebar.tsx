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
import { useAppDispatch, useAppSelector, useAppStore } from "@/redux/hooks";
import authenticate from "@/server-actions/auth/authenticate";
import { iUser, setUser } from "@/redux/features/user";
import SettingTemplate from "./setting";
import { socket } from "@/utils/socket";
import { listenMessages } from "@/libs/listenMessages";
import { sideBarToggle } from "@/redux/features/toggle";

function SidebarTemplate() {
  const dispatch = useAppDispatch();
  let user = useAppSelector((state) => state.user);
  const toggle= useAppSelector((state)=>state.toggle)
  useEffect(() => {
    authenticate().then((data: { success: boolean; user?: iUser }) => {
      dispatch(setUser(data?.user as iUser));
    });
    console.log("server: ", process.env.NEXT_PUBLIC_SERVER_URL as string);
  }, []);
  useEffect(() => {
    user?.id &&
      socket.OPEN &&
      socket.send(
        JSON.stringify({
          event: "user-connected",
          payload: { id: user?.id },
        })
      );
  }, [user]);
  const menu = [
    {
      label: "Messages",
      icon: <PiChatText />,
      onclick: () => {
        dispatch(sideBarToggle("messages"))
      },
    },
    {
      label: "Calls",
      icon: <IoCallOutline />,
      onclick: () => {
        dispatch(sideBarToggle("calls"))
      },
    },
  ];
  
  // listening to socket messages 
  const allFriends = useAppSelector((state)=>state.friends)
  socket.onmessage = (message) => {
    try {
      listenMessages(dispatch,allFriends,JSON.parse(message.data));
      console.log("message: ", message.data);
    } catch (error) {
      console.log("error on listening events");
    }
  };
  return (
    <section className="flex flex-col bg-slate-950 h-dvh items-center justify-between text-white px-2">
      <div className="flex flex-col mt-6 gap-5 ">
        <Drawer
          title="Profile"
          icon={
            <Avatar
              name={useAppSelector((state) => state.user?.name)}
              loading="eager"
              src={user?.avatar|| undefined}
            />
          }
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
              className={`transition-all ${toggle == label.toLowerCase()?  "bg-green-600/80" :"hover:bg-slate-900"}`}
              onClick={onclick}
            >
              {icon}
            </IconButton>
          ))}
        </div>
      </div>
      <div className="mb-14">
        <Drawer title="Setting" icon={<IoSettingsOutline />}>
          <SettingTemplate />
        </Drawer>
      </div>
    </section>
  );
}

export default memo(SidebarTemplate);
