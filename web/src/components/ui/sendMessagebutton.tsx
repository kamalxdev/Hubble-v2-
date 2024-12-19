"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import storeMessages from "@/actions/chats/storeMessages";
import { chakra, IconButton } from "@chakra-ui/react";
import { memo, useEffect, useRef } from "react";
import AutoResize from "react-textarea-autosize";
import { toaster } from "./toaster";
import { socket } from "@/utils/socket";
import { updateChats } from "@/redux/features/friends";
import { BsSend } from "react-icons/bs";

function SendMessageButton() {
  const userID = useAppSelector((state) => state.user.id);
  const dispatch = useAppDispatch();
  const friendID = useAppSelector((state) => state.chat.currentChatAreaUserID) as string;
  const StyledAutoResize = chakra(AutoResize);
  const textareaREF = useRef<HTMLTextAreaElement>(null);



  useEffect(()=>{


    if(textareaREF?.current){
      textareaREF.current.addEventListener("input",()=>{
        socket.send(
          JSON.stringify({
            event: "sendEvent-message-typing",
            payload: {
              id: friendID,
            },
          })
        );
      
      })
    }


  },[textareaREF])

  async function handleSendMessage() {
    if (!textareaREF.current?.value) return;
    const date = new Date();
    const text = textareaREF.current?.value;
    textareaREF.current.value = "";
    socket.send(
      JSON.stringify({
        event: "message-send",
        payload: {
          to: friendID,
          from: userID,
          text,
          time: date.toISOString(),
        },
      })
    );
    dispatch(
      updateChats({
        id: friendID,
        chats: {
          text,
          time: date.toISOString(),
          from: userID,
          status: "unread",
        },
      })
    );
    const storeChat = await storeMessages({
      sender: userID,
      reciever: friendID,
      message: {
        from: userID,
        text,
        status: "unread",
        time: date.toISOString(),
      },
    });
    if (!storeChat?.success)
      return toaster.create({
        title: "Error on storing message",
        type: "error",
      });
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

export default memo(SendMessageButton);
