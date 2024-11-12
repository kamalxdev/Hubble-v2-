import { SubscriberClient } from "../redis.config";
import { message } from "./messages";

export default async function redisSubscribe() {
  try {
    await SubscriberClient.subscribe("socket", (mes) => {
      const parsedData = JSON.parse(mes);
      message(parsedData?.data, parsedData?.ws);
    });
  } catch (error) {
    console.log("Error on subscribing message");
  }
}
