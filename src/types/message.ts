export type Message = {
  id: string;
  from: string; // userId
  to: string; // userId
  text: string;
  createdAt: number;
  read?: boolean;
};
