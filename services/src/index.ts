import http from "http";
import { WebSocketServer } from "ws";
import { iwebsocket, iwebsocketServer } from "./types";
import generateSocketID from "./lib/generateSocketID";
import { client, PublisherClient, startRedis } from "./redis.config";
import { deleteOfflineUser, iOnlineUser } from "./lib/onlineUser";
import { message } from "./lib/messages";
import { sendMessageToAll } from "./lib/chats";
import redisSubscribe from "./lib/subscriber";

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  let url = req.url;
  return res.end(`404 ERROR: ${url} Not authorized to access the server`);
});

export const wss = new WebSocketServer({ server }) as iwebsocketServer;

startRedis();

wss.on("connection", async function connection(ws: iwebsocket) {
  // generates a unique id for clients
  ws.id = generateSocketID();
  console.log("Connected: ", ws.id);

  //on error
  ws.on("error", console.error);

  // handling messages from client
  ws.on("message", async (data: any, isBinary) => {
    try {
      if (data) {
        const parsedData = JSON.parse(data);
        await PublisherClient.publish(
          "socket",
          JSON.stringify({ data: parsedData, ws })
        );
      } else {
        ws.send("No data to send");
      }
    } catch (error) {
      console.log("error on sending message", error);
      ws.send("Error on sending message");
    }
  });
  // handling disconnection
  ws.on("close", async (code, reason) => {
    try {
      let current_online_users = await client.get("OnlineUser");
      let current_online_users_json: iOnlineUser[] = JSON.parse(
        current_online_users as string
      );
      current_online_users_json.map((u) => {
        if (u?.ws_id == ws.id) {
          sendMessageToAll({
            event: "user-offline",
            payload: { id: u?.db_id },
          });
        }
      });
      deleteOfflineUser(ws.id);
      console.log("Disconnect: ", ws.id);
    } catch (error) {
      console.log("Error on making user offline", error);
    }
  });
  ws.send(`Connected ${ws.id}`);
});

server.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});

redisSubscribe();
