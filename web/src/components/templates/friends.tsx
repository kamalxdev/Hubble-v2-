"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import UserTemplate from "./user";
import { Fragment, memo, useEffect, useState } from "react";
import { getFriends } from "@/actions/user/friends";
import { iFriendSlice, setFriends } from "@/redux/features/friends";
import UserSkeletonTemplate from "./userSkeleton";

function FriendsTemplate() {
  const dispatch = useAppDispatch();
  const friends = useAppSelector((state) => state.friends);
  const reversedFriends = [...friends]?.reverse();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (friends?.length == 0) {
      setLoading(true);
      getFriends().then((data) => {
        setLoading(false);
        dispatch(setFriends(data?.friends as iFriendSlice[]));
        console.log("Friends: ", friends);
      });
    }
  }, []);
  if (loading) {
    return <UserSkeletonTemplate />;
  }

  return (
    <div className="absolute inline-flex flex-col w-full py-2 transition-all">
      {friends?.length > 0 ? (
        reversedFriends?.map(({ detail, messages }, index) => (
          <Fragment key={detail?.username}>
            <UserTemplate
              id={detail?.id}
              name={detail?.name}
              lastMessage={messages && messages[messages?.length - 1]?.text}
              time={messages && messages[messages?.length - 1]?.time}
              avatar={detail?.avatar}
              username={detail?.username}
              key={detail?.username + index}
            />
            {friends?.length != index + 1 && <hr className="mx-2 opacity-5" />}
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
