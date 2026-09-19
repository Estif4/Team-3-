import {
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";

type HeaderProps = {
  currentPage: string;
};

export default function Header({
  currentPage,
}: HeaderProps) {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between gap-4 px-6">
        {/* Current page */}
        <div className="min-w-[180px]">
          <p className="truncate text-sm font-semibold text-black">
            {currentPage}
          </p>
        </div>

        {/* Search */}
        <div className="hidden flex-1 justify-center px-6 md:flex">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              strokeWidth={1.8}
            />

            <input
              type="text"
              placeholder="Search tasks..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-[#0572B8] focus:bg-white focus:ring-2 focus:ring-[#0572B8]/10"
            />

            <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-400 sm:flex">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Online status */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-gray-600">
              Online
            </span>
          </div>

          {/* Online teammates */}
          <div className="hidden items-center -space-x-2 md:flex">
            <div
              title="Tsi - Online"
              className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black text-xs font-semibold text-white"
            >
              T
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
            </div>

            <div
              title="Hana - Online"
              className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#0572B8] text-xs font-semibold text-white"
            >
              H
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
            </div>

            <div
              title="Kirubel - Online"
              className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-400 text-xs font-semibold text-white"
            >
              K
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
            </div>
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#0572B8]/30"
            aria-label="Notifications"
          >
            <Bell
              className="h-5 w-5"
              strokeWidth={1.8}
            />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#0572B8] ring-2 ring-white" />
          </button>

          {/* Profile menu */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0572B8]/30"
          >
            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                T
              </div>

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
            </div>

            <span className="hidden text-sm font-medium text-black lg:block">
              Tsi
            </span>

            <ChevronDown
              className="hidden h-4 w-4 text-gray-400 lg:block"
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>
    </header>
  );
}