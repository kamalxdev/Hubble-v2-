const SERVER = process.env.NEXT_PUBLIC_SERVER_URL as string;

export var socket = new WebSocket(SERVER);

socket.onopen = () => {
  console.log("Connection established");
};

socket.onmessage = (message) => {
  try {
    // listenMessages(openChat,socket,webRTC,JSON.parse(message.data))
    console.log("message",message);
    
  } catch (error) {
    console.log("error on listening events");
  }
};

socket.onclose = () => {
  console.log("Disconnected");
  try {
    setTimeout(() => {
      socket = new WebSocket(SERVER);
    }, 1000);
  } catch (error) {
    alert("Cannot connect to server");
    console.log("websocket connection failed: ", error);
  }
};
