import { X } from "lucide-react";
import type { User } from "../../types/user.types";

type SelectedUsersProps = {
  users: User[];
  onRemove: (userId: string) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
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
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
        <p className="text-sm text-gray-500">
          No users added yet.
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
          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0572B8] text-xs font-semibold text-white">
            {getInitials(user.name)}
          </div>

          {/* User info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-black">
              {user.name}
            </p>

            <p className="truncate text-xs text-gray-500">
              {user.email}
            </p>
          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={() => onRemove(user.id)}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-red-600"
            aria-label={`Remove ${user.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}