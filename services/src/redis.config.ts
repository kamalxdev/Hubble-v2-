import { configDotenv } from "dotenv";
import { createClient } from "redis";

configDotenv();

export const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
  },
});

export const SubscriberClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
  },
});

export const PublisherClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
  },
});

export async function startRedis() {
  try {
    await client.connect();
    await SubscriberClient.connect();
    await PublisherClient.connect();

    client.set("OnlineUser", "[]");
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}
