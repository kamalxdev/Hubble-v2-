"use client";

import { callRejected, iCallSlice, setCall } from "@/redux/features/call";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import newCall from "@/server-actions/call/new";
import { IconButton } from "@chakra-ui/react";
import { memo, useEffect, useRef, useState } from "react";
import { AiFillAudio } from "react-icons/ai";
import { IoVideocam } from "react-icons/io5";
import { MdCallEnd, MdFullscreen } from "react-icons/md";
import { PiPictureInPictureFill } from "react-icons/pi";
import { toaster } from "../ui/toaster";
import { socket } from "@/utils/socket";
import { peers } from "@/utils/webRTC";

function CallAreaTemplate() {
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    if (peers?.receiver) {
      peers.receiver.ontrack = (event) => {
        if (friend_video?.current) {
          friend_video.current.srcObject = new MediaStream([event.track]);
        }
      };

      const track1 = peers?.receiver?.getTransceivers()[0]?.receiver?.track;
      const track2 = peers?.receiver?.getTransceivers()[1]?.receiver?.track;

      if (friend_video?.current && friend_mic.current && track1 && track2) {
        // const another_user_audio = new Audio();
        // another_user_audio.srcObject = new MediaStream([track1]);
        // another_user_audio.play();
        friend_mic.current.srcObject = new MediaStream([track1]);
        friend_video.current.srcObject = new MediaStream([track2]);
      }
    }
  }, [
    peers?.receiver?.getTransceivers()[1]?.receiver?.track,
    peers?.receiver?.getTransceivers()[0]?.receiver?.track,
  ]);
  // webrtc setup starts

  if (peers?.sender) {
    // icecandidate for sender
    peers.sender.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            event: "call-iceCandidate",
            payload: {
              id: (call as iCallSlice)?.user?.id,
              from: "sender",
              iceCandidate: event?.candidate,
            },
          })
        );
      }
    };

    // generating offer and starting connection
    peers.sender.onnegotiationneeded = async () => {
      let offer = await peers?.sender?.createOffer();
      await peers?.sender?.setLocalDescription(offer);
      socket.send(
        JSON.stringify({
          event: "call-offer",
          payload: {
            id: (call as iCallSlice)?.user?.id,
            type: (call as iCallSlice)?.type,
            offer: peers?.sender?.localDescription,
          },
        })
      );
    };
  }

  // iceCandidate for receiver
  if (peers?.receiver) {
    peers.receiver.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            event: "call-iceCandidate",
            payload: {
              id: (call as iCallSlice)?.user?.id,
              from: "receiver",
              iceCandidate: event?.candidate,
            },
          })
        );
      }
    };
  }

  // webrtc setup ends

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(async (stream) => {
        if (user_video?.current) {
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
        setCalling(false);
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
      .catch((err) => {
        console.log("Error on getting user media", err);
        dispatch(callRejected());
        toaster.create({
          title: "Access to media is required",
          type: "info",
        });
      });
  }, []);
  // toggle handlers
  function handleonVideoToggle() {
    if (toggleCalls?.video) {
      user_video?.current?.pause();
    } else {
      user_video?.current?.play();
    }
    if (peers?.sender?.getSenders()[1]?.track?.kind == "video") {
      (peers.sender.getSenders()[1].track as MediaStreamTrack).enabled =
        !peers?.sender?.getSenders()[1]?.track?.enabled;
    } else if (peers?.sender?.getSenders()[0]?.track?.kind == "video") {
      (
        (peers.sender as RTCPeerConnection).getSenders()[0]
          .track as MediaStreamTrack
      ).enabled = !peers?.sender?.getSenders()[0]?.track?.enabled;
    }
    setToggleCalls({ ...toggleCalls, video: !toggleCalls?.video });
  }
  function handleonAudioToggle() {
    if (peers?.sender?.getSenders()[1]?.track?.kind == "audio") {
      (peers.sender.getSenders()[1].track as MediaStreamTrack).enabled =
        !peers?.sender?.getSenders()[1]?.track?.enabled;
    } else if (peers?.sender?.getSenders()[0]?.track?.kind == "audio") {
      (
        (peers.sender as RTCPeerConnection).getSenders()[0]
          .track as MediaStreamTrack
      ).enabled = !peers?.sender?.getSenders()[0]?.track?.enabled;
    }
    setToggleCalls({ ...toggleCalls, audio: !toggleCalls?.audio });
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
  function handleonEndCall() {
    peers?.sender?.close();
    peers?.receiver?.close();
    socket.send(
      JSON.stringify({
        event: "call-end",
        payload: { id: call?.user?.id },
      })
    );
    peers.sender = new RTCPeerConnection();
    peers.receiver = new RTCPeerConnection();
    dispatch(callRejected());
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
          <audio ref={friend_mic} className="hidden" autoPlay></audio>
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
            onClick={handleonAudioToggle}
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
            onClick={handleonEndCall}
          >
            <MdCallEnd />
          </IconButton>
        </span>
      </div>
    </section>
  );
}

export default memo(CallAreaTemplate);
