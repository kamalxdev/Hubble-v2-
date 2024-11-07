"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import UserTemplate from "./user";
import { Fragment, memo, useEffect } from "react";
import { getFriends } from "@/server-actions/user/friends";
import { socket } from "@/utils/socket";
import { listenMessages } from "@/libs/listenMessages";

function FriendsTemplate() {
  const friends = useAppSelector((state) => state.friends);
  const dispatch =useAppDispatch()
  const friendID = useAppSelector((state) => state.chat.currentChatAreaUserID);

  const currentSelectedfriend = useAppSelector((state) =>
    (state?.friends).filter((f) => f?.detail?.id == friendID)
  )[0];
  const chats = currentSelectedfriend?.chats;
  useEffect(() => {
    // getFriends().then((data) => {
    //   console.log("data: ", data);
    // });
    console.log("friends", friends);
  }, [friends]);

  socket.onmessage = (message) => {
    try {
      listenMessages(chats,JSON.parse(message.data));
      console.log("message: ", message.data);
    } catch (error) {
      console.log("error on listening events");
    }
  };

  return (
    <div className="absolute inline-flex flex-col w-full">
      {friends.length > 0 ? (
        friends?.map(({ detail, chats }, index) => (
          <Fragment key={detail?.username}>
            <UserTemplate
              id={detail?.id}
              name={detail?.name}
              lastMessage={chats && chats[chats?.length - 1]?.text}
              time={chats && chats[chats?.length - 1]?.time}
              avatar={detail?.avatar}
              username={detail?.username}
              key={detail?.username}
            />
            {friends?.length != index + 1 && <hr className="mx-2 opacity-35" />}
          </Fragment>
        ))
      ) : (
        <div className="flex justify-center font-semibold text-lg opacity-20 pt-10">
          No Messages
        </div>
      )}
    </div>
  );
}

export default memo(FriendsTemplate);
