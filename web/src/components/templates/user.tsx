import { memo } from "react";
import { Avatar } from "../ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentChatAreaUserID } from "@/redux/features/chat";
import { updateFriends } from "@/redux/features/friends";

type iUserTemplate = {
  id: string;
  name: string;
  username: string;
  lastMessage?: string;
  time?: string;
  avatar: string | null;
};
function UserTemplate({
  id,
  name,
  username,
  time,
  lastMessage,
  avatar,
}: iUserTemplate) {
  const dispatch = useAppDispatch();
  function handleUserClick() {
    dispatch(
      updateFriends({ detail: { id, name, username, avatar }, messages: [] })
    );
    dispatch(setCurrentChatAreaUserID(id));
  }

  const currentUserID = useAppSelector(
    (state) => state?.chat?.currentChatAreaUserID
  );
  return (
    <button
      onClick={handleUserClick}
      className={`relative w-full flex items-center gap-4 p-2 rounded-sm transition-all ${
        id == currentUserID ? "bg-slate-900/50" : "hover:bg-slate-900/30"
      }`}
      key={username}
    >
      <div className="flex items-center justify-center">
        <Avatar name={name} loading="eager" src={avatar || undefined} />
      </div>
      <div className="w-full flex justify-center flex-col ">
        <span className="flex justify-between items-center">
          <h1 className="truncate">{name}</h1>
          <h4 className="text-xs opacity-50">
            @<i className="italic text-sm">{username}</i>
          </h4>
        </span>
        <span className="flex justify-between items-center">
          <h4 className="truncate opacity-50">{lastMessage || "No message"}</h4>
          <h4 className="text-xs opacity-75">
            {time &&
              new Date(time)
                ?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                .toLowerCase()}
          </h4>
        </span>
      </div>
    </button>
  );
}

export default memo(UserTemplate);
