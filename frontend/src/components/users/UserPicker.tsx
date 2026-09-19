import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Loader2,
  Plus,
  Search,
  UserPlus,
} from "lucide-react";

import type { User } from "../../types/user.types";
import { fetchUsers } from "../data/users.mock";
import SelectedUsers from "./SelectedUsers";

type UserPickerProps = {
  initialSelectedUsers?: User[];
  onChange?: (users: User[]) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusText(status: User["status"]) {
  switch (status) {
    case "online":
      return "Online";

    case "away":
      return "Away";

    default:
      return "Offline";
  }
}

export default function UserPicker({
  initialSelectedUsers = [],
  onChange,
}: UserPickerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] =
    useState<User[]>(initialSelectedUsers);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchUsers();

        setUsers(data);
      } catch {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  const isSelected = (userId: string) => {
    return selectedUsers.some((user) => user.id === userId);
  };

  const handleAddUser = (user: User) => {
    if (isSelected(user.id)) {
      return;
    }

    const updatedUsers = [...selectedUsers, user];

    setSelectedUsers(updatedUsers);

    onChange?.(updatedUsers);
  };

  const handleRemoveUser = (userId: string) => {
    const updatedUsers = selectedUsers.filter(
      (user) => user.id !== userId,
    );

    setSelectedUsers(updatedUsers);

    onChange?.(updatedUsers);
  };

  return (
    <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF5FB]">
            <UserPlus
              className="h-5 w-5 text-[#0572B8]"
              strokeWidth={1.8}
            />
          </div>

          <div>
            <h2 className="text-base font-semibold text-black">
              Add Members
            </h2>

            <p className="text-sm text-gray-500">
              Select users to add to your team.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-gray-200 p-5">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            strokeWidth={1.8}
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users by name or email..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-[#0572B8] focus:bg-white focus:ring-2 focus:ring-[#0572B8]/10"
          />
        </div>
      </div>

      {/* Available users */}
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">
            Available Users
          </h3>

          <span className="text-xs text-gray-500">
            {filteredUsers.length} users
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-[#0572B8]" />
              Loading users...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredUsers.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-sm font-medium text-black">
              No users found
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Try a different name or email.
            </p>
          </div>
        )}

        {/* User list */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="space-y-2">
            {filteredUsers.map((user) => {
              const selected = isSelected(user.id);

              return (
                <div
                  key={user.id}
                  className={[
                    "flex items-center gap-3 rounded-lg border p-3 transition",
                    selected
                      ? "border-[#0572B8]/30 bg-[#F7FBFD]"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                      {getInitials(user.name)}
                    </div>

                    <span
                      className={[
                        "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
                        user.status === "online" &&
                          "bg-green-500",
                        user.status === "away" &&
                          "bg-yellow-500",
                        user.status === "offline" &&
                          "bg-gray-400",
                      ].join(" ")}
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-black">
                      {user.name}
                    </p>

                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>

                      <span className="hidden text-xs text-gray-400 sm:inline">
                        •
                      </span>

                      <span className="hidden text-xs text-gray-500 sm:inline">
                        {getStatusText(user.status)}
                      </span>
                    </div>
                  </div>

                  {/* Add / Added */}
                  {selected ? (
                    <button
                      type="button"
                      disabled
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-xs font-medium text-gray-500"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Added
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddUser(user)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#0572B8] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#045f98] focus:outline-none focus:ring-2 focus:ring-[#0572B8]/30"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected users */}
      <div className="border-t border-gray-200 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">
            Selected Members
          </h3>

          <span className="text-xs font-medium text-[#0572B8]">
            {selectedUsers.length} selected
          </span>
        </div>

        <SelectedUsers
          users={selectedUsers}
          onRemove={handleRemoveUser}
        />
      </div>
    </div>
  );
}