import { X } from "lucide-react";
import type { User } from "../../types/user.types";

type SelectedUsersProps = {
  users: User[];
  onRemove: (userId: string) => void;
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

export default function SelectedUsers({
  users,
  onRemove,
}: SelectedUsersProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-[#F7F8FA] px-4 py-6 text-center">
        <p className="text-sm font-medium text-gray-600">
          No users selected
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Add users from the list above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{
              backgroundColor: user.avatarColor,
            }}
          >
            {getInitials(user.name)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-black">
              {user.name}
            </p>

            <p className="truncate text-xs text-gray-500">
              {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(user.id)}
            aria-label={`Remove ${user.name}`}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}