
export type iMessages = {
  text: string;
  time: string;
  status?: "read" | "unread";
  from: string;
};
