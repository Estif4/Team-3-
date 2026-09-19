import type { User } from "../../types/user.types";

export const mockUsers: User[] = [
  {
    id: "6aae5e484cdba07a8297871a",
    name: "estif",
    email: "estifk4@gmail.com",
    role: "MEMBER",
    avatarColor: "#3498db",
    status: "online",
    isActive: true,
    lastSeenAt: "2026-09-19T10:04:56.400Z",
  },

  {
    id: "2",
    name: "Tsi",
    email: "tsi@example.com",
    role: "MEMBER",
    avatarColor: "#0572B8",
    status: "online",
    isActive: true,
    lastSeenAt: "2026-09-19T10:02:00.000Z",
  },

  {
    id: "3",
    name: "Hana",
    email: "hana@example.com",
    role: "MEMBER",
    avatarColor: "#8B5CF6",
    status: "online",
    isActive: true,
    lastSeenAt: "2026-09-19T10:01:00.000Z",
  },

  {
    id: "4",
    name: "Kirubel",
    email: "kirubel@example.com",
    role: "MEMBER",
    avatarColor: "#F59E0B",
    status: "online",
    isActive: true,
    lastSeenAt: "2026-09-19T09:58:00.000Z",
  },

  {
    id: "5",
    name: "Meron",
    email: "meron@example.com",
    role: "MEMBER",
    avatarColor: "#10B981",
    status: "away",
    isActive: true,
    lastSeenAt: "2026-09-19T09:40:00.000Z",
  },

  {
    id: "6",
    name: "Abel",
    email: "abel@example.com",
    role: "MEMBER",
    avatarColor: "#EF4444",
    status: "offline",
    isActive: true,
    lastSeenAt: "2026-09-19T08:30:00.000Z",
  },

  {
    id: "7",
    name: "Samuel",
    email: "samuel@example.com",
    role: "MEMBER",
    avatarColor: "#6366F1",
    status: "offline",
    isActive: true,
    lastSeenAt: "2026-09-19T07:20:00.000Z",
  },

  {
    id: "8",
    name: "Betty",
    email: "betty@example.com",
    role: "ADMIN",
    avatarColor: "#EC4899",
    status: "online",
    isActive: true,
    lastSeenAt: "2026-09-19T10:03:00.000Z",
  },

  {
    id: "9",
    name: "Daniel",
    email: "daniel@example.com",
    role: "MEMBER",
    avatarColor: "#14B8A6",
    status: "away",
    isActive: true,
    lastSeenAt: "2026-09-19T09:35:00.000Z",
  },
];

export async function fetchUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  return mockUsers;
}