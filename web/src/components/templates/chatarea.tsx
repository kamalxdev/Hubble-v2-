"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Avatar } from "../ui/avatar";
import { chakra, IconButton, useRecipe } from "@chakra-ui/react";
import AutoResize from "react-textarea-autosize";
import { BsCheck, BsCheckAll, BsCheckLg, BsSend } from "react-icons/bs";
import { IoCallOutline, IoVideocamOutline } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { socket } from "@/utils/socket";

function ChatAreaTemplate() {
  const friendID = useAppSelector((state) => state.chat.currentChatAreaUserID);
  const userID = useAppSelector((state) => state.user.id);
  const friend = useAppSelector((state) =>
    (state?.friends).filter((f) => f?.detail?.id == friendID)
  )[0];
  const chats = friend?.chats;
  const StyledAutoResize = chakra(AutoResize);
  const textareaREF=useRef<HTMLTextAreaElement>(null)
  
  const userOptions = [
    {
      name: "Voice Call",
      icon: <IoCallOutline />,
      onclick: () => {
        alert("label");
      },
    },
    {
      name: "Video Call",
      icon: <IoVideocamOutline />,
      onclick: () => {
        alert("label");
      },
    },
    {
      name: "Options",
      icon: <HiOutlineDotsVertical />,
      onclick: () => {
        alert("label");
      },
    },
  ];
  function handleSendMessage() {    
    socket.send(
      JSON.stringify({
        event: "message-send",
        payload: {
          to: friendID,
          from: userID,
          text: textareaREF.current?.value,
          time: new Date(),
        },
      })
    );
  }
  return (
    <div className="relative h-screen grid grid-rows-[8%_1fr_auto] border border-slate-800">
      <div className="border-b border-slate-800 flex items-center justify-between px-7 py-3">
        <span className="flex items-center gap-3">
          <Avatar name={friend?.detail?.name || "N A"} loading="lazy" />
          <h1 className="text-2xl font-semibold opacity-80 ">
            {friend?.detail?.name || "N A"}
          </h1>
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
            {chats?.length > 1 ? (
              chats?.map(({ type, text, time, status }, index) => (
                <Chat
                  type={type as "sender" | "reciever"}
                  text={text}
                  time={time}
                  state={status}
                  key={text + index}
                />
              ))
            ) : (
              <div className="flex justify-center font-semibold text-lg opacity-20">
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
            ref={textareaREF}
            // onChange={(e) => {setMessage(e.target.value)}}
            // defaultValue={message}
          />
        </span>
        <span className="relative">
          <IconButton
            aria-label={"send"}
            className="hover:bg-green-900"
            onClick={handleSendMessage}
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
  state?: string;
  type: "sender" | "reciever";
  time: Date;
};

const Chat = memo(function Chat({ text, state, time, type }: iChat) {
  return (
    <span
      key={text}
      className={`flex flex-col  justify-between ${
        type == "sender" ? "items-start" : "items-end"
      }`}
    >
      <span
        className={`pt-1 pl-2 pr-1 rounded-md max-w-25 ${
          type == "sender" ? "bg-zinc-800" : "bg-white text-black"
        }`}
      >
        <p className="truncate text-lg text-wrap">{text}</p>
        <span className="flex items-end justify-end gap-1">
          <p className="opacity-50 italic text-[0.70rem]">
            {time && new Date(time).getDate()}
          </p>
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
