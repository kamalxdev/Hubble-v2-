
import { createClient } from "redis";

export const client = createClient({
  socket:{
    host:process.env.REDIS_HOST,
    port:parseInt(process.env.REDIS_PORT as string)
  }
})

client.on('connect',()=>{
  console.log("Connected to Redis");
});

export async function startRedis() {
  try {    
    if(!client.isOpen){
      await client.connect();
    }
  } catch (error) {
    console.log("Failed to connect to Redis", error);
  }
}