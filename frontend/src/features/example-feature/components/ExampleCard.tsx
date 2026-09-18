import React from 'react';
import { ExampleItem } from '../types/example.types.js';
import { Tag, Calendar, User, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../app/store.js';
import { useDeleteExample } from '../hooks/useExamples.js';

export interface ExampleCardProps {
  item: ExampleItem;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({ item }) => {
  const { user } = useAuthStore();
  const { mutate: deleteItem, isPending } = useDeleteExample();

  const isOwnerOrAdmin = user?.role === 'admin' || user?._id === item.createdBy?._id;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-blue-950/60 text-blue-400 border border-blue-800/40">
            {item.category}
          </span>
          {isOwnerOrAdmin && (
            <button
              onClick={() => deleteItem(item._id)}
              disabled={isPending}
              className="text-slate-500 hover:text-red-400 p-1 transition rounded"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <h3 className="text-base font-semibold text-white mb-1.5">{item.title}</h3>
        <p className="text-sm text-slate-400 line-clamp-3 mb-4">{item.description}</p>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag, i) => (
              <span key={i} className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {item.createdBy?.name || 'Anonymous'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
