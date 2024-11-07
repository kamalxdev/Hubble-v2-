import { listenMessages } from "@/libs/listenMessages";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL as string;

export var socket = new WebSocket(SERVER);

socket.onopen = () => {
  console.log("Connection established");
};

socket.onclose = () => {
  try {
    console.log("Disconnected");
    setTimeout(() => {
      socket = new WebSocket(SERVER);
    }, 1000);
  } catch (error) {
    alert("Cannot connect to server");
    console.log("websocket connection failed: ", error);
  }
};
