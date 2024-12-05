
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL as string;

export const socket = new WebSocket(SERVER);

socket.onopen = () => {
  console.log("Connection established");
};

socket.onclose = () => {
  try {
    console.log("Disconnected");
    alert("Cannot connect to server");

  } catch (error) {
    console.log("websocket connection failed: ", error);
  }
};
