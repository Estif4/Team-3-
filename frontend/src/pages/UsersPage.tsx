import UserPicker from "../components/users/UserPicker";
import type { User } from "../types/user.types";

export default function UsersPage() {
  const handleUsersChange = (users: User[]) => {
    console.log("Selected users:", users);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-6">
      <UserPicker onChange={handleUsersChange} />
    </div>
  );
}