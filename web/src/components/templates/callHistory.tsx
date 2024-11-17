"use Client";
import getCallHistory from "@/actions/call/history";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Fragment, memo, useEffect, useState } from "react";
import { toaster } from "../ui/toaster";
import {
  icallHistorySlice,
  setCallHistory,
} from "@/redux/features/callHistory";
import { Avatar } from "../ui/avatar";
import { IoCall, IoVideocam } from "react-icons/io5";
import { MdCallMade, MdCallReceived } from "react-icons/md";
import UserSkeletonTemplate from "./userSkeleton";

function CallHistoryTemplate() {
  const userID = useAppSelector((state) => state?.user?.id);
  const dispatch = useAppDispatch();
  const history = useAppSelector((state) => state?.callHistory);

  const reversedCallHistory = [...history]?.reverse();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (history?.length != 0) return;
    setLoading(true);
    getCallHistory(userID)
      .then((data) => {
        setLoading(false);
        if (!data?.success) return;
        dispatch(setCallHistory(data?.history as icallHistorySlice[]));
      })
      .catch((err) => {
        console.log("Error on getting Call History: ", err);
        return toaster.create({
          title: "Internal Server Error",
          type: "error",
        });
      });
  }, []);
  if (loading) {
    return <UserSkeletonTemplate />;
  }

  return (
    <div className="absolute inline-flex flex-col w-full py-2 transition-all">
      {history?.length > 0 ? (
        reversedCallHistory?.map(
          ({ id, answer, caller, receiver, type, createdAt }, index) => (
            <Fragment key={id}>
              <CallHistoryUser
                id={id}
                answer={answer}
                caller={caller}
                receiver={receiver}
                type={type}
                createdAt={createdAt}
              />
              {history?.length != index + 1 && (
                <hr className="mx-2 opacity-5" />
              )}
            </Fragment>
          )
        )
      ) : (
        <div className="flex justify-center font-semibold text-lg opacity-20 pt-10">
          No Calls found {history?.length}
        </div>
      )}
    </div>
  );
}

const CallHistoryUser = memo(function CallHistoryUser({
  id,
  answer,
  caller,
  receiver,
  type,
  createdAt,
}: icallHistorySlice) {
  const user = caller || receiver;
  return (
    <div
      key={id}
      className={`relative w-full flex items-center gap-4 p-2 rounded-sm transition-all `}
    >
      <div className="flex items-center justify-center">
        <Avatar
          name={user?.name}
          loading="eager"
          src={user?.avatar || undefined}
        />
      </div>
      <div className="w-full flex justify-center flex-col ">
        <span className="flex justify-between items-center">
          <h1 className="truncate">{user?.name}</h1>
          <h4 className="text-xs opacity-50">
            @<i className="italic text-sm">{user?.username}</i>
          </h4>
        </span>
        <span className="flex justify-between items-center">
          <h4 className="truncate opacity-50 flex gap-2 items-center">
            {caller ? (
              <MdCallReceived
                className={answer ? "text-green-600" : "text-red-600"}
              />
            ) : (
              <MdCallMade
                className={answer ? "text-green-600" : "text-red-600"}
              />
            )}
            <p className="normal-case truncate text-sm">
              {createdAt &&
                new Date(createdAt)?.toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
            </p>
          </h4>
          <h4 className="text-sm">
            {type == "video" ? <IoVideocam /> : <IoCall />}
          </h4>
        </span>
      </div>
    </div>
  );
});

export default memo(CallHistoryTemplate);
