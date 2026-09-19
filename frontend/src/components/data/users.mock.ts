import type { User } from "../../types/user.types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Tsi",
    email: "tsi@example.com",
    status: "online",
  },
  {
    id: "2",
    name: "Hana",
    email: "hana@example.com",
    status: "online",
  },
  {
    id: "3",
    name: "Kirubel",
    email: "kirubel@example.com",
    status: "online",
  },
  {
    id: "4",
    name: "Meron",
    email: "meron@example.com",
    status: "away",
  },
  {
    id: "5",
    name: "Abel",
    email: "abel@example.com",
    status: "offline",
  },
  {
    id: "6",
    name: "Samuel",
    email: "samuel@example.com",
    status: "offline",
  },
  {
    id: "7",
    name: "Betty",
    email: "betty@example.com",
    status: "online",
  },
  {
    id: "8",
    name: "Daniel",
    email: "daniel@example.com",
    status: "away",
  },
];

/**
 * Frontend-only fake fetch.
 * Later replace this with your real API request.
 */
export async function fetchUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  return mockUsers;
}