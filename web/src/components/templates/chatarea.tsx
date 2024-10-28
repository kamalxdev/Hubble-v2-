"use client";

import { memo } from "react";
import { Avatar } from "../ui/avatar";
import { chakra, IconButton } from "@chakra-ui/react";
import { MdOutlineCall } from "react-icons/md";
import { FiVideo } from "react-icons/fi";
import { SlOptionsVertical } from "react-icons/sl";
import AutoResize from "react-textarea-autosize";
import { BsCheck, BsCheckAll, BsCheckLg, BsSend } from "react-icons/bs";

function ChatAreaTemplate() {
  const StyledAutoResize = chakra(AutoResize);

  const chats = [
    {
      text: "Hello",
      type: "sender",
      time: "9:45 pm",
      read: true,
    },
    {
      text: "Hellofd gdf g df gdf g dfg fd g df gd fg df g fg  df \n dfgdfg dfgdfgdfgfd \n d gdgfdgfdg",
      type: "reciever",
      time: "9:45 pm",
      read: false,
    },
    {
      text: "Hello",
      type: "reciever",
      time: "9:45 pm",
      read: true,
    },
    {
      text: "Hello",
      type: "sender",
      time: "9:45 pm",
      read: false,
    },
    {
      text: "Hello",
      type: "sender",
      time: "9:45 pm",
      read: true,
    },
    {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: true,
      },
      {
        text: "Hellofd gdf g df gdf g dfg fd g df gd fg df g fg  df \n dfgdfg dfgdfgdfgfd \n d gdgfdgfdg",
        type: "reciever",
        time: "9:45 pm",
        read: false,
      },
      {
        text: "Hello",
        type: "reciever",
        time: "9:45 pm",
        read: true,
      },
      {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: false,
      },
      {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: true,
      },
      {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: true,
      },
      {
        text: "Hellofd gdf g df gdf g dfg fd g df gd fg df g fg  df \n dfgdfg dfgdfgdfgfd \n d gdgfdgfdg",
        type: "reciever",
        time: "9:45 pm",
        read: false,
      },
      {
        text: "Hello",
        type: "reciever",
        time: "9:45 pm",
        read: true,
      },
      {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: false,
      },
      {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: true,
      },
      {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: true,
      },
      {
        text: "Hellofd gdf g df gdf g dfg fd g df gd fg df g fg  df \n dfgdfg dfgdfgdfgfd \n d gdgfdgfdg",
        type: "reciever",
        time: "9:45 pm",
        read: false,
      },
      {
        text: "Hello",
        type: "reciever",
        time: "9:45 pm",
        read: true,
      },
      {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: false,
      },
      {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: true,
      },
      {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: true,
      },
      {
        text: "Hellofd gdf g df gdf g dfg fd g df gd fg df g fg  df \n dfgdfg dfgdfgdfgfd \n d gdgfdgfdg",
        type: "sender",
        time: "9:45 pm",
        read: false,
      },
      {
        text: "Hello",
        type: "reciever",
        time: "9:45 pm",
        read: true,
      },
      {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: false,
      },
      {
        text: "Hello",
        type: "sender",
        time: "9:45 pm",
        read: true,
      },
  ];
  const userOptions = [
    {
      name: "Voice Call",
      icon: <MdOutlineCall />,
      onclick: () => {
        alert("label");
      },
    },
    {
      name: "Video Call",
      icon: <FiVideo />,
      onclick: () => {
        alert("label");
      },
    },
    {
      name: "Options",
      icon: <SlOptionsVertical />,
      onclick: () => {
        alert("label");
      },
    },
  ];

  return (
    <div className="relative h-screen grid grid-rows-[auto_1fr_auto] border border-slate-800">
      <div className="border-b border-slate-800 flex items-center justify-between px-7 py-3">
        <span className="flex items-center gap-3">
          <Avatar name={"Kamal Singh"} loading="lazy" />
          <h1 className="text-2xl font-semibold opacity-80 ">Kamal Singh</h1>
        </span>
        <span>
          {userOptions?.map(({ name, icon, onclick }) => (
            <IconButton
              aria-label={name}
              key={name}
              className="hover:bg-slate-900"
              onClick={onclick}
            >
              {icon}
            </IconButton>
          ))}
        </span>
      </div>
      <div className="relative overflow-y-scroll overflow-hidden p-4">
        <div className="relative">
          <div className="absolute inline-flex flex-col w-full gap-2">
            {chats ? (
              chats?.map(({ type, text, time, read }, index) => (
                <Chat
                  type={type as "sender" | "reciever"}
                  text={text}
                  time={time}
                  state={read}
                  key={text+index}
                />
              ))
            ) : (
              <div className="flex justify-center font-semibold text-lg opacity-50">
                Start a Conversation by typing a message below.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative w-full max-h-40 overflow-hidden flex items-center px-5 py-2 gap-2">
        <span className="relative w-full h-full overflow-y-scroll rounded-sm">
          <StyledAutoResize
            placeholder="Type your message"
            minH="full"
            resize="none"
            overflow="hidden"
            lineHeight="inherit"
            className=" border-0 outline-0 w-full h-full p-3 flex items-center"
            //   css={styles}
          />
        </span>
        <span className="relative">
          <IconButton
            aria-label={"send"}
            className="hover:bg-green-900"
            onClick={() => alert("hello")}
          >
            <BsSend />
          </IconButton>
        </span>
      </div>
    </div>
  );
}

type iChat = {
  text: string;
  state: boolean;
  type: "sender" | "reciever";
  time: string;
};

const Chat = memo(function Chat({ text, state, time, type }: iChat) {
  return (
    <span
      key={text}
      className={`flex flex-col  justify-between ${
        type == "sender" ? "items-start" : "items-end"
      }`}
    >
      <span className={`pt-1 pl-2 pr-1 rounded-md max-w-25 ${type == "sender" ?"bg-zinc-800":"bg-white text-black"}`}>
        <p className="truncate text-lg text-wrap">{text}</p>
        <span className="flex items-end justify-end gap-1">
          <p className="opacity-50 italic text-[0.70rem]">{time}</p>
          {state ? (
            <BsCheckAll className="text-green-700 text-lg" />
          ) : (
            <BsCheck className="text-lg" />
          )}
        </span>
      </span>
    </span>
  );
});

export default memo(ChatAreaTemplate);
