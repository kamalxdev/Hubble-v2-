"use client";

import { iCallSlice } from "@/redux/features/call";
import { useAppSelector } from "@/redux/hooks";
import { socket } from "@/utils/socket";
import { createContext, useEffect, useState } from "react";

interface iPeers {
  sender?: RTCPeerConnection;
  receiver?: RTCPeerConnection;
}

export interface iPeerContext {
  peers: iPeers;
  startStreaming: (type: "video" | "voice") => void;
  setPeers: (v: iPeers) => void;
}

export const PeerContext = createContext<iPeerContext | null>(null);

export function PeerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [peers, setPeers] = useState<iPeers>({});
  const call = useAppSelector((state) => state?.call) as iCallSlice;

  useEffect(() => {
    if (!peers?.sender || !peers?.receiver) {
      setPeers({
        sender: new RTCPeerConnection(),
        receiver: new RTCPeerConnection(),
      });
    }
  }, [peers]);

  function startStreaming(type: "video" | "voice") {
    console.log("Streaming started");

    if (peers?.sender) {
      const isVideo = type == "video";
      navigator.mediaDevices
        .getUserMedia({ video: isVideo, audio: true })
        .then((stream) => {
          peers?.sender?.addTrack(stream.getAudioTracks()[0]);
          if (isVideo) {
            peers?.sender?.addTrack(stream.getVideoTracks()[0]);
          }
        });
    }
  }

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
      const offer = await peers?.sender?.createOffer();

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

  return (
    <PeerContext.Provider value={{ peers, startStreaming, setPeers }}>
      {children}
    </PeerContext.Provider>
  );
}
