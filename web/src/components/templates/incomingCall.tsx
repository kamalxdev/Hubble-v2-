"use client";

import { memo, useEffect } from "react";
import { Avatar } from "../ui/avatar";
import { IoVideocam } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  callAnswered,
  callRejected,
  iCallSlice,
  setCall,
} from "@/redux/features/call";
import { socket } from "@/utils/socket";
import { initializePeers, startStreaming } from "@/utils/webRTC";
import { toaster } from "../ui/toaster";
// import { initializeWebRTCpeers, startStreaming } from "@/redux/features/webRTC";

function IncomingCallTemplate() {
  const call = useAppSelector((state) => state?.call) as iCallSlice;
  const dispatch = useAppDispatch();
  useEffect(() => {
    const audio = new Audio("/ring.wav");
    audio.loop = true;
    audio.play();
    const callTimeout = setTimeout(() => {
      audio.pause();
      socket.send(
        JSON.stringify({
          event: "call-answer",
          payload: {
            id: call?.id,
            accepted: false,
            type: call?.type,
            to: call?.user?.id,
          },
        })
      );
      dispatch(callRejected());
    }, 20000);
    return () => {
      audio.pause();
      audio.remove();
      clearTimeout(callTimeout);
    };
  }, []);
  function handleAcceptCall() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        dispatch(callAnswered());
        initializePeers();
        socket.send(
          JSON.stringify({
            event: "call-answer",
            payload: {
              id: call?.id,
              accepted: true,
              type: call?.type,
              to: call?.user?.id,
            },
          })
        );
        startStreaming(call?.type);
      })
      .catch((err) => {
        console.log("Error on getting user media", err);
        toaster.create({
          title: "Access to media is required",
          type: "info",
        });
      });
  }
  function handleRejectCall() {
    socket.send(
      JSON.stringify({
        event: "call-answer",
        payload: {
          id: call?.id,
          accepted: false,
          type: call?.type,
          to: call?.user?.id,
        },
      })
    );
    dispatch(callRejected());
  }
  return (
    <div className="relative mt-5 w-full md:w-5/12 xl:w-3/12  z-40 bg-black text-white p-4 flex flex-col">
      <div className="flex items-center gap-2 ">
        <p className="opacity-20 font-bold">Incoming Call</p>{" "}
        <IoVideocam className="text-green-600" />
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center w-full gap-2">
          <Avatar
            name={call?.user?.name || "N A"}
            loading="eager"
            src={call?.user?.avatar || undefined}
          />
          <h1 className="text-nowrap">{call?.user?.name || "N A"}</h1>
        </span>
        <span className="w-full flex gap-3">
          <button
            type="button"
            className="bg-red-700 w-full py-1 rounded-sm"
            onClick={handleRejectCall}
          >
            Reject
          </button>
          <button
            type="button"
            className="bg-green-700 w-full py-1 rounded-sm"
            onClick={handleAcceptCall}
          >
            Answer
          </button>
        </span>
      </div>
    </div>
  );
}

export default memo(IncomingCallTemplate);
