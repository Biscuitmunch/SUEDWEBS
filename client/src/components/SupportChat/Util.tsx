export const MsgSenders = {
  user: "user",
  bot: "assistant",
  system: "system",
  info: "info",
  error: "error",
} as const;

export interface Message {
  content: string;
  role: (typeof MsgSenders)[keyof typeof MsgSenders];
  time: Date;
}
