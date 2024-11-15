"use client";

import { IconButton } from "@chakra-ui/react";
import { memo, useEffect, useRef, useState } from "react";
import { AiFillAudio } from "react-icons/ai";
import { IoVideocam } from "react-icons/io5";
import { MdCallEnd, MdFullscreen } from "react-icons/md";
import { PiPictureInPictureFill } from "react-icons/pi";

function CallAreaTemplate() {
  const user_video = useRef<HTMLVideoElement>(null);
  const friend_video = useRef<HTMLVideoElement>(null);
  const [toggleCalls, setToggleCalls] = useState({
    video: true,
    audio: true,
    pip: false,
    fullScreen: false,
  });
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (user_video?.current) {
          user_video.current.srcObject = stream;
        }

        if (friend_video?.current) {
          friend_video.current.srcObject = stream;
        }
      });
  }, []);

  // toggle handlers
  function handleonVideoToggle() {
    if (toggleCalls?.video) {
      user_video?.current?.pause();
    } else {
      user_video?.current?.play();
    }
    setToggleCalls({ ...toggleCalls, video: !toggleCalls?.video });
  }
  function handleonPIPToggle() {
    if (toggleCalls?.pip) {
      document?.pictureInPictureElement && document?.exitPictureInPicture();
    } else {
      friend_video?.current?.requestPictureInPicture();
    }
    setToggleCalls({ ...toggleCalls, pip: !toggleCalls?.pip });
  }
  function handleonFullScreenToggle() {
    if (toggleCalls?.fullScreen) {
      document?.fullscreenElement && document?.exitFullscreen();
    } else {
      friend_video?.current?.requestFullscreen({ navigationUI: "hide" });
    }
    setToggleCalls({ ...toggleCalls, fullScreen: !toggleCalls?.fullScreen });
  }
  return (
    <section className="relative w-full border border-slate-800">
      <div className="w-full h-full relative">
        <span className="relative w-full h-full object-contain flex items-center justify-center z-30">
          <video
            autoPlay
            ref={friend_video}
            muted
            className="absolute w-full h-full"
          ></video>
        </span>
        <span className="absolute w-2/12 h-auto z-40 bottom-20 right-20 drop-shadow-2xl border border-slate-800 rounded-md overflow-hidden">
          <video
            autoPlay
            ref={user_video}
            muted
            className={`w-full h-full ${!toggleCalls?.video && "blur-sm"}`}
          ></video>
        </span>
      </div>
      <div className="absolute w-full h-full top-0 z-40 flex flex-col items-center justify-end lg:pb-16">
        <span className="bg-slate-950 justify-around flex lg:gap-3 w-full lg:w-auto p-2 lg:rounded-md">
          <IconButton
            aria-label="Video"
            className={`transition-all ${
              toggleCalls?.video ? "bg-green-500" : "hover:bg-slate-900"
            }`}
            onClick={handleonVideoToggle}
          >
            <IoVideocam />
          </IconButton>
          <IconButton
            aria-label="Audio"
            className={`transition-all ${
              toggleCalls?.audio ? "bg-green-500" : "hover:bg-slate-900"
            }`}
            //   onClick={onclick}
          >
            <AiFillAudio />
          </IconButton>
          <IconButton
            aria-label="Full Screen"
            className={`transition-all hover:bg-slate-900`}
            onClick={handleonFullScreenToggle}
          >
            <MdFullscreen />
          </IconButton>
          <IconButton
            aria-label="Picture In Picture"
            className={`transition-all hover:bg-slate-900`}
            onClick={handleonPIPToggle}
          >
            <PiPictureInPictureFill />
          </IconButton>
          <IconButton
            aria-label="End Call"
            className={`transition-all hover:bg-red-700`}
            //   onClick={onclick}
          >
            <MdCallEnd />
          </IconButton>
        </span>
      </div>
    </section>
  );
}

export default memo(CallAreaTemplate);
