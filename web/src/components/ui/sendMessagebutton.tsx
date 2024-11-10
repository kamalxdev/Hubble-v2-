"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import storeMessages from "@/server-actions/chats/storeMessages";
import { chakra, IconButton } from "@chakra-ui/react";
import { useRef } from "react";
import AutoResize from "react-textarea-autosize";
import { toaster } from "./toaster";
import { socket } from "@/utils/socket";
import { updateChats } from "@/redux/features/friends";
import { BsSend } from "react-icons/bs";

export default function SendMessageButton() {
  const userID = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();
  const friendID = useAppSelector((state) => state.chat.currentChatAreaUserID);
  const StyledAutoResize = chakra(AutoResize);
  const textareaREF = useRef<HTMLTextAreaElement>(null);

  async function handleSendMessage() {
    if (!textareaREF.current?.value) return;
    let date = new Date();
    const storeChat = await storeMessages({
      sender: userID,
      reciever: friendID,
      message: {
        from: userID,
        text: textareaREF.current?.value,
        status: "unread",
        time: date.toISOString(),
      },
    });
    if (!storeChat?.success)
      return toaster.create({
        title: "Error on storing message",
        type: "error",
      });
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
    return dispatch(
      updateChats({
        id: friendID,
        chats: {
          text: textareaREF.current?.value,
          time: date.toISOString(),
          from: userID,
          status: "unread",
        },
      })
    );
  }

  return (
    <>
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
    </>
  );
}
