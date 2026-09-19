export type UserStatus = "online" | "away" | "offline";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: UserStatus;
};