import { wss } from "..";
import { iwebsocket } from "../types";
import { findOnlineUsers } from "./onlineUser";
import WebSocket from "ws";


// send message to everyone in the websocket connection
export function sendMessageToAll(data: any) {
    wss.clients.forEach(function each(client: iwebsocket) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
  
  // function to send message to specified user
  export async function sendMessageToSpecific(data: {event:string,payload:{}}, send_to: string) {
    try {
      let sendTo = await findOnlineUsers('db',send_to);
  
      if (sendTo) {
        wss.clients.forEach(function each(client: iwebsocket) {
          if (client?.id == sendTo?.ws_id && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      }
    } catch (error) {
      console.log("Error in sending specific user messages: ", error);
    }
  }
  