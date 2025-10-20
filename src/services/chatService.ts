export type Message = { id: string; text: string; from: string; to: string; createdAt: number };
const messages: Message[] = [];

export async function sendMessage(text: string, to: string) {
  const msg: Message = { id: Math.random().toString(36).slice(2), text, from: "me", to, createdAt: Date.now() };
  messages.push(msg);
  return msg;
}

export async function listMessages(withUser: string) {
  return messages.filter((m) => m.to === withUser || m.from === withUser);
}
