


export type iChats = {
    type: "sender" | "reciever";
    text: string;
    time: string;
    status? : "read" | "unread" 
  };