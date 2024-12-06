"use client";

import { callRejected, iCallSlice, setCall } from "@/redux/features/call";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import newCall from "@/actions/call/new";
import { IconButton } from "@chakra-ui/react";
import { memo, RefObject, useEffect, useRef, useState } from "react";
import { AiFillAudio } from "react-icons/ai";
import { IoVideocam } from "react-icons/io5";
import { MdCallEnd, MdFullscreen } from "react-icons/md";
import { PiPictureInPictureFill } from "react-icons/pi";
import { toaster } from "../ui/toaster";
import { socket } from "@/utils/socket";
import { usePeersProvider } from "@/hooks/peers";
import { Avatar } from "../ui/avatar";

function CallAreaTemplate() {
  const dispatch = useAppDispatch();
  const peer = usePeersProvider();

  const call = useAppSelector((state) => state?.call) as iCallSlice;

  const user_video = useRef<HTMLVideoElement>(null);
  const friend_video = useRef<HTMLVideoElement>(null);
  const friend_mic = useRef<HTMLAudioElement>(null);

  const [calling, setCalling] = useState(true);

  const [toggleCalls, setToggleCalls] = useState({
    video: true,
    audio: true,
    pip: false,
    fullScreen: false,
  });

  const isVideoCall = call?.type == "video";
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: isVideoCall, audio: true })
      .then(async (stream) => {
        if (user_video?.current && isVideoCall) {
          user_video.current.srcObject = stream;
        }

        if (call?.id) return;

        const callData = await newCall(call?.user?.id as string, call?.type);
        if (!callData.success) {
          return toaster.create({
            title: callData?.error,
            type: "error",
          });
        }


        socket.send(
          JSON.stringify({
            event: "call-send",
            payload: {
              id: callData?.call?.id,
              to: call?.user?.id,
              type: call?.type,
            },
          })
        );

        dispatch(
          setCall({
            ...call,
            id: callData?.call?.id as string,
          })
        );
      })
      .catch((err:Error) => {
        console.log("Error on getting user media", err);

        dispatch(callRejected());

        toaster.create({
          title: err?.message || "Access to media is required",
          type: "info",
        });
      });
  }, []);

  useEffect(() => {
    if (call?.isAnswered) {
      setCalling(false);
    }
  }, [call?.isAnswered]);

  // toggle handlers

  function handleonVideoToggle() {
    if (toggleCalls?.video) {
      user_video?.current?.pause();
    } else {
      user_video?.current?.play();
    }

    if (peer?.peers?.sender?.getSenders()[1]?.track?.kind == "video") {
      (peer?.peers.sender.getSenders()[1].track as MediaStreamTrack).enabled =
        !peer?.peers?.sender?.getSenders()[1]?.track?.enabled;
    } else if (peer?.peers?.sender?.getSenders()[0]?.track?.kind == "video") {
      (
        (peer?.peers.sender as RTCPeerConnection).getSenders()[0]
          .track as MediaStreamTrack
      ).enabled = !peer?.peers?.sender?.getSenders()[0]?.track?.enabled;
    }

    setToggleCalls({ ...toggleCalls, video: !toggleCalls?.video });
  }

  function handleonAudioToggle() {
    if (peer?.peers?.sender?.getSenders()[1]?.track?.kind == "audio") {
      (peer?.peers.sender.getSenders()[1].track as MediaStreamTrack).enabled =
        !peer?.peers?.sender?.getSenders()[1]?.track?.enabled;
    } else if (peer?.peers?.sender?.getSenders()[0]?.track?.kind == "audio") {
      (
        (peer?.peers.sender as RTCPeerConnection).getSenders()[0]
          .track as MediaStreamTrack
      ).enabled = !peer?.peers?.sender?.getSenders()[0]?.track?.enabled;
    }

    setToggleCalls({ ...toggleCalls, audio: !toggleCalls?.audio });
  }

  function handleonPIPToggle() {
    if (!friend_video?.current) return;

    if (toggleCalls?.pip && document?.pictureInPictureElement) {
      document?.exitPictureInPicture();
    } else {
      friend_video?.current?.requestPictureInPicture();
    }

    setToggleCalls({ ...toggleCalls, pip: !toggleCalls?.pip });
  }

  function handleonFullScreenToggle() {
    if (!friend_video?.current) return;

    if (toggleCalls?.fullScreen && document?.fullscreenElement) {
      document?.exitFullscreen();
    } else {
      friend_video?.current?.requestFullscreen({ navigationUI: "hide" });
    }

    setToggleCalls({ ...toggleCalls, fullScreen: !toggleCalls?.fullScreen });
  }

  function handleonEndCall() {
    peer?.peers?.sender?.close();
    peer?.peers?.receiver?.close();

    socket.send(
      JSON.stringify({
        event: "call-end",
        payload: { id: call?.user?.id },
      })
    );

    peer?.setPeers({
      sender: new RTCPeerConnection(),
      receiver: new RTCPeerConnection(),
    });

    dispatch(callRejected());
  }

  const toggleButtons = [
    {
      label: "Video",
      classname: toggleCalls?.video ? "bg-green-500" : "hover:bg-slate-900",
      onclick: () => handleonVideoToggle(),
      icon: <IoVideocam />,
    },
    {
      label: "Audio",
      classname: toggleCalls?.audio ? "bg-green-500" : "hover:bg-slate-900",
      onclick: () => handleonAudioToggle(),
      icon: <AiFillAudio />,
    },
    {
      label: "Full Screen",
      classname: "hover:bg-slate-900",
      onclick: () => handleonFullScreenToggle(),
      icon: <MdFullscreen />,
    },
    {
      label: "Picture In Picture",
      classname: "hover:bg-slate-900",
      onclick: () => handleonPIPToggle(),
      icon: <PiPictureInPictureFill />,
    },
    {
      label: "End Call",
      classname: "hover:bg-red-700",
      onclick: () => handleonEndCall(),
      icon: <MdCallEnd />,
    },
  ];
  const onlyAudioCallButton = ["Audio", "End Call"];
  return (
    <section className="relative w-full h-full border border-slate-800">
      <div className="w-full h-full relative">
        {call?.type == "video" ? (
          <VideoCallTemplate
            friend_video={friend_video}
            friend_mic={friend_mic}
            user_video={user_video}
            isVideoEnabled={toggleCalls?.video}
          />
        ) : (
          <VoiceCallTemplate friend_mic={friend_mic} calling={calling}/>
        )}
      </div>
      <div className="absolute w-full h-full top-0 z-40 flex flex-col items-center justify-end lg:pb-16">
        <span className="bg-slate-950 justify-around flex lg:gap-3 w-full lg:w-auto p-2 lg:rounded-md">
          {toggleButtons?.map(
            ({ label, classname, onclick, icon }) =>
              (isVideoCall || onlyAudioCallButton?.includes(label)) && (
                <IconButton
                  aria-label={label}
                  className={`transition-all ${classname}`}
                  onClick={onclick}
                  key={label}
                >
                  {icon}
                </IconButton>
              )
          )}
        </span>
      </div>
    </section>
  );
}

type iVideoCallTemplate = {
  friend_video: RefObject<HTMLVideoElement>;
  friend_mic: RefObject<HTMLAudioElement>;
  user_video: RefObject<HTMLVideoElement>;
  isVideoEnabled: boolean;
};

const VideoCallTemplate = memo(function VideoCallTemplate({
  friend_video,
  friend_mic,
  user_video,
  isVideoEnabled,
}: iVideoCallTemplate) {
  const peer = usePeersProvider();
  const track1 = peer?.peers?.receiver?.getTransceivers()[0]?.receiver?.track;
  const track2 = peer?.peers?.receiver?.getTransceivers()[1]?.receiver?.track;
  useEffect(() => {
    if (peer?.peers?.receiver) {
      peer.peers.receiver.ontrack = (event) => {
        if (friend_video?.current) {
          friend_video.current.srcObject = new MediaStream([event.track]);
        }
      };

      if (friend_video?.current && friend_mic?.current && track1 && track2) {
        console.log("Got track :", track1, track2);
        friend_mic.current.srcObject = new MediaStream([track1]);
        friend_video.current.srcObject = new MediaStream([track2]);
      }
    }
  }, [track1, track2]);

  return (
    <>
      <span className="relative w-full h-full object-contain flex items-center justify-center z-30">
        <video
          autoPlay
          ref={friend_video}
          muted
          className="absolute w-full h-full"
        ></video>
        <audio ref={friend_mic} className="hidden" autoPlay></audio>
      </span>
      <span className="absolute w-2/12 h-auto z-40 bottom-20 right-20 drop-shadow-2xl border border-slate-800 rounded-md overflow-hidden">
        <video
          autoPlay
          ref={user_video}
          muted
          className={`w-full h-full ${!isVideoEnabled && "blur-sm"}`}
        ></video>
      </span>
    </>
  );
});

const VoiceCallTemplate = memo(function VoiceCallTemplate({
  friend_mic,
  calling,
}: {
  friend_mic: RefObject<HTMLAudioElement>;
  calling: boolean;
}) {
  const call = useAppSelector((state) => state?.call);
  return (
    <>
      <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
        <Avatar
          name={call?.user?.name || "N A"}
          loading="eager"
          src={call?.user?.avatar || undefined}
          className="flex justify-center items-center border-4 p-3 border-green-500 rounded-full animate-pulse w-48 h-auto"
        />
        <Avatar
          name={call?.user?.name || "N A"}
          loading="eager"
          src={call?.user?.avatar || undefined}
          className=" absolute flex justify-center items-center border-4 p-3 border-green-500 rounded-full animate-ping w-40 h-auto"
        />
        <h1 className="text-green-500 font-semibold">{calling?"Calling...":"Connected"}</h1>
      </div>
      <audio ref={friend_mic} className="hidden" autoPlay></audio>
    </>
  );
});

export default memo(CallAreaTemplate);
