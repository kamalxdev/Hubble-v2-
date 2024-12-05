"use client";

import { memo, useEffect, useRef } from "react";
import { Avatar } from "../ui/avatar";
import { IconButton } from "@chakra-ui/react";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { IoCallOutline, IoVideocamOutline } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { iMessages } from "@/types/chats";
import SendMessageButton from "../ui/sendMessagebutton";
import { socket } from "@/utils/socket";
import { setCall } from "@/redux/features/call";
import { IoMdArrowRoundBack } from "react-icons/io";
import { setCurrentChatAreaUserID, setUserOnline, setUserTyping } from "@/redux/features/chat";

function ChatAreaTemplate() {
  const dispatch = useAppDispatch();
  const friendID = useAppSelector((state) => state.chat.currentChatAreaUserID);
  const isUserOnline = useAppSelector((state) => state?.chat?.isUserOnline);
  const isUserTyping = useAppSelector((state) => state?.chat?.isUserTyping);

  const friend = useAppSelector((state) =>
    state?.friends?.filter((f) => f?.detail?.id == friendID)
  )[0];
  const chats = friend?.messages;
  const divref = useRef(null);

  async function makeCall(type: "video" | "voice") {
    dispatch(
      setCall({
        user: friend.detail,
        isAnswered: false,
        isSender: true,
        type,
        id: "",
      })
    );
  }

  const userOptions = [
    {
      name: "Voice Call",
      icon: <IoCallOutline />,
      onclick: () => makeCall("voice"),
    },
    {
      name: "Video Call",
      icon: <IoVideocamOutline />,
      onclick: () => makeCall("video"),
    },
    {
      name: "Options",
      icon: <HiOutlineDotsVertical />,
      onclick: () => {
        alert("label");
      },
    },
  ];

  useEffect(() => {
    if (divref.current) {
      (divref?.current as HTMLElement)?.scrollIntoView({ behavior: "smooth" });
    }
  });

  useEffect(() => {
    if (chats?.length > 0) {
      socket.send(
        JSON.stringify({
          event: "message-read",
          payload: {
            id: friendID,
          },
        })
      );
    }
  }, [chats]);

  useEffect(()=>{
    if(friendID){
      socket.send(
        JSON.stringify({
          event: "user-online-request",
          payload: { id: friendID },
        })
      );
    }
    return ()=>{
      dispatch(setUserOnline(false));
      dispatch(setUserTyping(false))
    }
  },[friendID])

  if (!friendID) {
    return (
      <div className="flex justify-center items-center opacity-25 border border-slate-800">
        Start a new conversation or continue to previous chats
      </div>
    );
  }

  return (
    <div className="relative w-screen lg:w-full h-dvh grid grid-rows-[auto_1fr_auto] border border-slate-800">
      <div className="border-b border-slate-800 flex items-center justify-between px-7 py-3">
        <span className="flex items-center gap-3">
          <button
            onClick={() => dispatch(setCurrentChatAreaUserID(""))}
            className="lg:hidden"
          >
            <IoMdArrowRoundBack />
          </button>
          <Avatar
            name={friend?.detail?.name || "N A"}
            loading="eager"
            src={friend?.detail?.avatar || undefined}
          />
          <span className="flex flex-col transition-all">
            <h1 className="text-xl font-semibold flex items-center gap-2 transition-all">
              {friend?.detail?.name || "N A"}
              {isUserOnline && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              )}
            </h1>
            {isUserTyping && (
              <p className="text-green-600 font-semibold text-xs transition-all">
                typing...
              </p>
            )}
          </span>
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
            {chats?.length > 0 ? (
              chats?.map(({ from, text, time, status }, index) => (
                <Chat
                  from={from}
                  text={text}
                  time={time}
                  status={status}
                  key={text + index}
                />
              ))
            ) : (
              <div className="flex justify-center font-semibold text-base opacity-10">
                Start a Conversation by typing a message below.
              </div>
            )}
            <div ref={divref}></div>
          </div>
        </div>
      </div>
      <div className="relative w-full max-h-40 overflow-hidden flex items-center px-5 py-2 gap-2">
        <SendMessageButton />
      </div>
    </div>
  );
}

const Chat = memo(function Chat({ text, status, time, from }: iMessages) {
  const userID = useAppSelector((state) => state.user.id);
  const isUserMsg = from == userID;
  return (
    <span
      key={text}
      className={`flex flex-col  justify-between ${
        isUserMsg ? "items-end" : "items-start"
      }`}
    >
      <span
        className={`pt-1 pl-2 pr-1 rounded-md max-w-25 ${
          isUserMsg ? "bg-white text-black" : " bg-zinc-800"
        }`}
      >
        <p className="truncate text-lg text-wrap">{text}</p>
        <span className="flex items-end justify-end gap-1">
          <p className="opacity-50 italic text-[0.70rem]">
            {time &&
              new Date(time)
                ?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                .toLowerCase()}
          </p>
          {isUserMsg &&
            status &&
            (status == "read" ? (
              <BsCheckAll className="text-green-700 text-lg" />
            ) : (
              <BsCheck className="text-lg" />
            ))}
        </span>
      </span>
    </span>
  );
});

export default memo(ChatAreaTemplate);
