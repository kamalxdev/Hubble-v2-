import { memo } from "react";
import { Avatar } from "../ui/avatar";

type iUserTemplate = {
  name: string;
  username: string;
  lastMessage: string;
  time: string;
  avatar?: string;
};
function UserTemplate({
  name,
  username,
  time,
  lastMessage,
  avatar,
}: iUserTemplate) {
  return (
    <div className="relative w-full flex gap-4 px-4 py-2 hover:bg-slate-900/80" key={username}>
      <div className="flex items-center justify-center">
        <Avatar name={name} loading="lazy" src={avatar}/>
      </div>
      <div className="w-full">
        <span className="flex justify-between items-center">
            <h1 className="truncate">{name}</h1>
            <h4 className="text-xs opacity-50">@<i className="italic text-sm">{username}</i></h4>
        </span>
        <span className="flex justify-between items-center">
            <h4 className="truncate opacity-50">{lastMessage}</h4>
            <h4 className="text-xs opacity-75">{time}</h4>
        </span>
      </div>
    </div>
  );
}

export default memo(UserTemplate);
