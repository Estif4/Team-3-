export type UserStatus = "online" | "away" | "offline";

export type UserRole = "MEMBER" | "ADMIN" | "OWNER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
  status: UserStatus;
  isActive: boolean;
  lastSeenAt: string;
};