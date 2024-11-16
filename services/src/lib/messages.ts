import { findOnlineUsers, setOnlineUsers } from "./onlineUser";
import { iwebsocket } from "../types";
import { sendMessageToAll, sendMessageToSpecific } from "./chats";

export async function message(
  data: { event: string; payload: any },
  ws: iwebsocket
) {
  console.log("Socket: ", data);
  
  const message_recieved_from = await findOnlineUsers("ws", ws.id);
  if (data?.event) {
    switch (data?.event) {
      case "user-connected":
        console.log("user-connected: ", JSON.stringify(data), ws.id);
        if (data?.payload?.id) {
          await setOnlineUsers({ ws_id: ws?.id, db_id: data?.payload?.id });
          sendMessageToAll({
            event: "user-online",
            payload: { id: data?.payload?.id },
          });
        }
        break;
      case "user-online-request":
        if (
          data?.payload?.id &&
          (await findOnlineUsers("db", data?.payload?.id))
        ) {
          ws.send(
            JSON.stringify({
              event: "user-online-response",
              payload: { id: data?.payload?.id },
            })
          );
        }
        break;

      // listen to user message and redirect it to 'to user'
      case "message-send":
        if (data?.payload?.to && data?.payload?.from && data?.payload?.text) {
          sendMessageToSpecific(
            {
              event: "message-recieved",
              payload: {
                from: data?.payload?.from,
                text: data?.payload?.text,
                time: data?.payload?.time || new Date(),
                status: data?.payload?.status,
              },
            },
            data?.payload?.to
          );
        }
        break;

      // whenever a chat is read
      case "message-read":
        if (data?.payload?.id) {
          sendMessageToSpecific(
            {
              event: "message-read-recieved",
              payload: {
                id: message_recieved_from?.db_id,
              },
            },
            data?.payload?.id
          );
        }
        break;
      //
      // sending user typing event
      case "message-send-start-typing":
        if (data?.payload?.to) {
          sendMessageToSpecific(
            {
              event: "message-recieved-start-typing",
              payload: { id: message_recieved_from?.db_id },
            },
            data?.payload?.to
          );
        }
        break;

      // transferring call to given user
      case "call-send":
        if (data?.payload?.id && data?.payload?.to && data?.payload?.type) {
          sendMessageToSpecific(
            {
              event: "call-received",
              payload: {
                id:data?.payload?.id,
                from: message_recieved_from?.db_id,
                type: data?.payload?.type,
              },
            },
            data?.payload?.to
          );
        }
        break;

      case "call-answer":
        if (data?.payload?.id && data?.payload?.to) {
          sendMessageToSpecific(
            {
              event: "call-answer-received",
              payload: {
                id: message_recieved_from?.db_id,
                accepted: data?.payload?.accepted,
                type: data?.payload?.type,
              },
            },
            data?.payload?.to
          );
        }
        break;

      // listening to user call offer from sender and sending to the specified user i.e. reciever of call
      case "call-offer":
        if (
          data?.payload?.id &&
          data?.payload?.offer &&
          data?.payload?.type &&
          (await findOnlineUsers("db", data?.payload?.id))?.db_id
        ) {
          sendMessageToSpecific(
            {
              event: "call-offer-received",
              payload: {
                id: message_recieved_from?.db_id,
                type: data?.payload?.type,
                offer: data?.payload?.offer,
              },
            },
            data?.payload?.id
          );
        }
        break;

      // listening to call answer from reciever
      case "call-offer-answer":
        if (
          data?.payload?.id &&
          data?.payload?.answer &&
          data?.payload?.type &&
          (await findOnlineUsers("db", data?.payload?.id))?.db_id
        ) {
          sendMessageToSpecific(
            {
              event: "call-offer-answer-recieved",
              payload: {
                id: message_recieved_from?.db_id,
                answer: data?.payload?.answer,
                type: data?.payload?.type,
              },
            },
            data?.payload?.id
          );
        }
        break;

      // exchanging iceCandidates
      case "call-iceCandidate":
        if (
          data?.payload?.id &&
          data?.payload?.iceCandidate &&
          data?.payload?.from &&
          (await findOnlineUsers("db", data?.payload?.id))?.db_id
        ) {
          sendMessageToSpecific(
            {
              event: "call-iceCandidate-recieved",
              payload: {
                id: message_recieved_from?.db_id,
                from: data?.payload?.from,
                iceCandidate: data?.payload?.iceCandidate,
              },
            },
            data?.payload?.id
          );
        }
        break;

      // end of call
      case "call-end":
        if (data?.payload?.id) {
          sendMessageToSpecific(
            {
              event: "call-ended",
              payload: {
                id: message_recieved_from?.db_id,
              },
            },
            data?.payload?.id
          );
        }
        break;

      default:
        console.log("No event found");

        break;
    }
  } else {
    console.log("Event missing");
    ws.send("Event missing");
  }
}
