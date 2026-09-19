import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  UserPlus,
} from "lucide-react";

import { fetchUsers } from "../data/users.mock";
import type { User } from "../../types/user.types";
import SelectedUsers from "./SelectedUsers";

type UserPickerProps = {
  initialSelectedUsers?: User[];
  onChange?: (users: User[]) => void;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
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

    case "offline":
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUsers();
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
    return selectedUsers.some(
      (user) => user.id === userId,
    );
  };

  const handleAddUser = (user: User) => {
    if (isSelected(user.id)) {
      return;
    }

    const nextUsers = [...selectedUsers, user];

    setSelectedUsers(nextUsers);
    onChange?.(nextUsers);
  };

  const handleRemoveUser = (userId: string) => {
    const nextUsers = selectedUsers.filter(
      (user) => user.id !== userId,
    );

    setSelectedUsers(nextUsers);
    onChange?.(nextUsers);
  };

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white">
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
              Find users and add them to your team.
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
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search users by name or email..."
            className="h-11 w-full rounded-lg border border-gray-200 bg-[#F7F8FA] pl-10 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-[#0572B8] focus:bg-white focus:ring-2 focus:ring-[#0572B8]/10"
          />
        </div>
      </div>

      {/* Available users */}
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">
            Available Users
          </h3>

          {!loading && !error && (
            <span className="text-xs text-gray-500">
              {filteredUsers.length} users
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2
              className="h-6 w-6 animate-spin text-[#0572B8]"
              strokeWidth={1.8}
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading users...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg border border-gray-200 bg-[#F7F8FA] p-5">
            <p className="text-sm font-medium text-black">
              Couldn't load users
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void loadUsers();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0572B8] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#045f98] focus:outline-none focus:ring-2 focus:ring-[#0572B8]/30"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredUsers.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-[#F7F8FA] p-8 text-center">
              <p className="text-sm font-medium text-black">
                No users found
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Try a different name or email.
              </p>
            </div>
          )}

        {/* User list */}
        {!loading &&
          !error &&
          filteredUsers.length > 0 && (
            <div className="max-h-[430px] space-y-2 overflow-y-auto pr-1">
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
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor: user.avatarColor,
                        }}
                      >
                        {getInitials(user.name)}
                      </div>

                      {user.status === "online" && (
                        <span
                          className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"
                          title="Online"
                        />
                      )}
                    </div>

                    {/* User info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-black">
                        {user.name}
                      </p>

                      <div className="mt-0.5 flex items-center gap-2">
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
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-xs font-medium text-gray-500"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Added
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          handleAddUser(user);
                        }}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#0572B8] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#045f98] focus:outline-none focus:ring-2 focus:ring-[#0572B8]/30"
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

      {/* Selected */}
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