import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers.js';
import { UserCard } from '../components/UserCard.js';
import { Input } from '../../../components/ui/Input.js';
import { useDebounce } from '../../../hooks/useDebounce.js';
import { Users as UsersIcon, Loader2 } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, error } = useUsers({ search: debouncedSearch });
  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-blue-500" />
            Users Directory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and manage all registered users in the application.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mr-2 text-blue-500" />
          <span>Loading users...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-950/30 border border-red-900 rounded-xl text-red-400 text-sm">
          Failed to load users list.
        </div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
          <UsersIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No users found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <UserCard key={u._id} user={u} />
          ))}
        </div>
      )}
    </div>
  );
};
