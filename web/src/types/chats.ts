


export type iChats = {
    type: "sender" | "reciever";
    text: string;
    time: Date;
    status? : "read" | "unread" 
  };