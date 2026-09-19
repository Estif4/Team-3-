/**
 * components/Column.tsx — stub placeholder.
 * The Kanban column/drag-and-drop UI will be implemented here
 * as part of the real-time collaboration feature.
 */

export interface ColumnProps {
  title: string;
  status: string;
  tasks: { _id: string; title: string }[];
}

export function Column({ title, tasks }: ColumnProps) {
  return (
    <div className="flex-1 rounded-xl bg-gray-800 p-4">
      <h2 className="mb-3 font-semibold text-white">{title}</h2>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t._id} className="rounded-lg bg-gray-700 p-3 text-sm text-white">
            {t.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
