import type { User } from "../types/user.types";
import UserPicker from "../components/users/UserPicker";

export default function UsersPage() {
  const handleUsersChange = (users: User[]) => {
    console.log("Selected users:", users);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Team Members
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Find users and add them to your team.
        </p>
      </div>

      <UserPicker onChange={handleUsersChange} />
    </div>
  );
}