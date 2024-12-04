"use client";

import CallHistoryTemplate from "@/components/templates/callHistory";
import ChatAreaTemplate from "@/components/templates/chatarea";
import CallAreaTemplate from "@/components/templates/callArea";
import FriendsTemplate from "@/components/templates/friends";
import SidebarTemplate from "@/components/templates/sidebar";
import { useAppSelector } from "@/redux/hooks";
import IncomingCallTemplate from "@/components/templates/incomingCall";
import { iCallSlice } from "@/redux/features/call";

export default function Home() {
  const toggle = useAppSelector((state) => state?.toggle);
  const call = useAppSelector((state) => state?.call);
  const currentChatUserID = useAppSelector(
    (state) => state?.chat?.currentChatAreaUserID
  );

  return (
    <>
      {(call as iCallSlice)?.id &&
        !(call as iCallSlice)?.isSender &&
        !(call as iCallSlice)?.isAnswered && (
          <section className="w-full flex items-center justify-center absolute ">
            <IncomingCallTemplate />
          </section>
        )}
      <section className="flex flex-nowrap bg-slate-950">
        <section
          className={
            `relative border border-slate-800 lg:block ${currentChatUserID && "hidden"}`
          }
        >
          <SidebarTemplate />
        </section>
        <section className="realtive w-full h-dvh text-white lg:grid lg:grid-cols-[25%_1fr]">
          <div className="relative h-dvh grid grid-rows-[auto_1fr] border border-slate-800 pb-4">
            <h1 className="text-2xl font-semibold opacity-80 border-b border-slate-800 p-4 capitalize">
              {toggle}
            </h1>
            <div className="relative overflow-y-scroll overflow-hidden px-2">
              <div className="relative">
                {toggle == "messages" ? (
                  <FriendsTemplate />
                ) : (
                  <CallHistoryTemplate />
                )}
              </div>
            </div>
          </div>
          {(call as iCallSlice)?.isSender ||
          (call as iCallSlice)?.isAnswered ? (
            <CallAreaTemplate />
          ) : (
            currentChatUserID && <ChatAreaTemplate />
          )}
        </section>
      </section>
    </>
  );
}
