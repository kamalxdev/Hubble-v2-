import { client } from "../redis.config";

export type iOnlineUser = {
  db_id: string;
  ws_id: string;
  platform?: string;
};

export async function setOnlineUsers(data: iOnlineUser) {
  try {
    deleteOfflineUser(data?.ws_id);
    let current_online_users = await client.get("OnlineUser");
    if (current_online_users) {
      let current_online_user_json: iOnlineUser[] =
        JSON.parse(current_online_users);
      let isUser = current_online_user_json?.filter(
        (o) => o?.db_id != data?.db_id
      );
      await client.set("OnlineUser", JSON.stringify([...isUser, data]));
    } else {
      await client.set("OnlineUser", JSON.stringify([data]));
    }
    let online = await client.get("OnlineUser");
    console.log("from redis: ", JSON.parse(online as string));
  } catch (error) {
    console.log("Error on setting user online", error);
  }
}

export async function findOnlineUsers(using: "db" | "ws", id: string) {
  try {
    let current_online_user = await client.get("OnlineUser");
    let current_online_user_json: iOnlineUser[] = JSON.parse(
      current_online_user as string
    );
    if (using == "db") {
      let user_to_find = current_online_user_json.find((u) => u?.db_id == id);
      return user_to_find;
    } else if (using == "ws") {
      let user_to_find = current_online_user_json.find((u) => u?.ws_id == id);
      return user_to_find;
    }
  } catch (error) {
    console.log("Error on finding user online", error);
  }
}

export async function deleteOfflineUser(ws_id: string) {
  try {
    let current_online_users = await client.get("OnlineUser");
    let current_online_users_json: iOnlineUser[] = JSON.parse(
      current_online_users as string
    );
    let filter_offline_user = current_online_users_json.filter(
      (u) => u?.ws_id != ws_id
    );
    await client.set("OnlineUser", JSON.stringify(filter_offline_user));
  } catch (error) {
    console.log("Error on deleting offline user", error);
  }
}
