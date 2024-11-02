'use client';


import { useAppSelector } from "@/redux/hooks";
import UserTemplate from "./user";
import { memo, useEffect } from "react";
import { getFriends } from "@/server-actions/user/friends";

function FriendsTemplate() {
  useEffect(()=>{
    getFriends().then((data)=>{
      console.log("data: ",data);
    })
  },[])
  const friends = useAppSelector((state) => state.friends);
  return (
    <div className="absolute inline-flex flex-col w-full">
      {friends.length < 0 ? (
        friends?.map(({ detail, chats }, index) => (
          <>
            <UserTemplate
              name={detail?.name}
              lastMessage={chats[chats?.length - 1].text}
              time={chats[chats?.length - 1].time}
              avatar={detail?.avatar}
              username={detail?.username}
              key={detail?.username}
            />
            {friends?.length != index + 1 && <hr className="mx-2 opacity-35" />}
          </>
        ))
      ) : (
        <div className="flex justify-center font-semibold text-lg opacity-20 pt-10">
          No Messages
        </div>
      )}
    </div>
  );
}


export default memo(FriendsTemplate)