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
        <section className="relative border border-slate-800">
          <SidebarTemplate />
        </section>
        <section className="realtive w-full h-dvh text-white grid grid-cols-[35%_65%] xl:grid-cols-[30%_70%]">
          <div className="relative h-dvh grid grid-rows-[8%_92%] border border-slate-800 pb-4">
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
            <ChatAreaTemplate />
          )}
        </section>
      </section>
    </>
  );
}
