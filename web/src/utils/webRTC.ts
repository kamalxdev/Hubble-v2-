
export var peers = {
  sender: new RTCPeerConnection(),
  receiver: new RTCPeerConnection(),
};

export function startStreaming(type: "video" | "voice") {
  if (peers?.sender) {
    let isVideo = type == "video";
    navigator.mediaDevices
      .getUserMedia({ video: isVideo, audio: true })
      .then((stream) => {
        peers?.sender?.addTrack(stream.getAudioTracks()[0]);
        isVideo && peers?.sender?.addTrack(stream.getVideoTracks()[0]);
      });
  }
}

